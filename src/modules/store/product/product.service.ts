import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { IProduct, ProductStatusEnum } from "./schema/product.schema";
import { CreateProductDto, CreateVariantDto } from "./dto/create-product-dto";
import { UserRoleEnum, UserStoreRoleEnum } from "src/modules/users/schema/user.schema";
import { UpdateProductDto, UpdateVariantDto } from "./dto/update-product-dto";
import { ProductCategoriesService } from "../productCategories/productCategories.service";
import { ProductSortByEnum } from "./dto/get-product-dto";
import { generateSku } from "src/utils/helperFunctions";
import { SearchProductQueryDto, SearchProductSortByEnum } from "./dto/search-product-dto";
import { WebsiteService } from "src/modules/website/website.service";




@Injectable()
export class ProductService {

    private readonly PRODUCT_BATCH_LIMIT = 20

    constructor(
        @InjectModel('Product') private Product: Model<IProduct>,
        private readonly productCategoryService: ProductCategoriesService,
        private readonly websiteService: WebsiteService
    ) { }

    async createProduct(websiteKey: string, newProductDetail: CreateProductDto, userId: string, userRole: UserRoleEnum) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const newProduct = new this.Product({ ...newProductDetail, websiteKey });

        newProduct.vendor = mongoose.Types.ObjectId.createFromHexString(userId);

        const ids = newProduct.variants.map(variant => variant.variantId)
        const uniqueIds = new Set(ids);
        if (ids.length !== uniqueIds.size) {
            throw new ConflictException('Duplicate Ids found in product variants');
        }

        const skus = newProduct.variants.map(variant => variant.sku);
        const uniqueSkus = new Set(skus);
        if (skus.length !== uniqueSkus.size) {
            throw new ConflictException('Duplicate SKUs found in product variants');
        }

        // Query to check if any of the SKUs already exist for this vendor
        const conflict = await this.Product.findOne({
            vendor: newProduct.vendor,
            websiteKey,
            'variants.sku': { $in: skus },
        });

        if (conflict) {
            throw new ConflictException('One or more SKUs are already registered with this vendor');
        }


        // If vendor/contributor creates a product to be published, change its status to 'awaiting approval'
        if (userRole === UserRoleEnum.CONTRIBUTOR && newProduct.status === ProductStatusEnum.PUBLISHED) {
            newProduct.status = ProductStatusEnum.AWAITING_APPROVAL;
        }

        try {
            await newProduct.save();

        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('SKU already registered')
            }
            throw error;
        }
    }

    async getProducts(
        websiteKey: string,
        status: ProductStatusEnum,
        isDeleted: boolean,
        userId: string,
        categoryId: string,
        sortBy: string,
        lastId: string,
        searchQuery?: string,
    ) {

        const website = await this.websiteService.getWebsiteByKey(websiteKey);
        if (!website) {
            throw new BadRequestException('Invalid website key');
        }

        const pipeline: mongoose.PipelineStage[] = [];

        /////////////////////////////////////////
        // Match stage
        /////////////////////////////////////////
        const matchStage: Record<string, any> = { websiteKey};

        if (status) {
            matchStage.status = status;
        } else {
            matchStage.status = { $ne: ProductStatusEnum.DRAFT }
        }

        if (isDeleted !== undefined) {
            matchStage.isDeleted = isDeleted;
        }

        if (userId) {
            matchStage.vendor = new mongoose.Types.ObjectId(userId);
        }

        if (categoryId) {
            matchStage.category = new mongoose.Types.ObjectId(categoryId);
        }

        // Add text search condition if searchQuery is provided
        if (searchQuery) {
            matchStage.$text = { $search: searchQuery };
        }


        switch (sortBy) {
            case ProductSortByEnum.OLDEST:
                if (lastId) {
                    matchStage._id = { $gt: new mongoose.Types.ObjectId(lastId) };
                }
                break;

            case ProductSortByEnum.RECENT:
                if (lastId) {
                    matchStage._id = { $lt: new mongoose.Types.ObjectId(lastId) };
                }
                break;

        }

        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }




        /////////////////////////////////////////
        // Lookup stage to populate references
        /////////////////////////////////////////
        pipeline.push(
            // Populate vendor
            {
                $lookup: {
                    from: 'users',
                    localField: 'vendor',
                    foreignField: '_id',
                    as: 'vendor',
                },
            },
            { $unwind: { path: '$vendor', preserveNullAndEmptyArrays: true } },
            // Populate category
            {
                $lookup: {
                    from: 'productcategories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } }
        );




        /////////////////////////////////////////
        // Sorting stage
        /////////////////////////////////////////
        const sortStage: Record<string, 1 | -1 | { $meta: 'textScore' }> = {};
        switch (sortBy) {
            case ProductSortByEnum.OLDEST:
                sortStage._id = 1;
                break;

            case ProductSortByEnum.RECENT:
                sortStage._id = -1;
                break;

        }

        // If there's a search query, prioritize sorting by text score first
        if (searchQuery) {
            sortStage.score = { $meta: 'textScore' }; // Sort by text score if search query is present
            sortStage._id = -1;
        }


        if (Object.keys(sortStage).length > 0) {
            pipeline.push({ $sort: sortStage });
        }

        /////////////////////////////////////////
        // Limit stage
        /////////////////////////////////////////
        pipeline.push({ $limit: this.PRODUCT_BATCH_LIMIT });


        // Execute the aggregation pipeline
        try {
            const products = await this.Product.aggregate(pipeline).exec();
            return products;
        } catch (error) {
            console.error('Error executing aggregation pipeline:', error);
            throw new Error('Failed to fetch products');
        }


    }

    async getLatestProduct(websiteKey: string, vendorId: string) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const query = { websiteKey, status: ProductStatusEnum.PUBLISHED, isDeleted: false }
        if (vendorId) {
            query['vendor'] = vendorId
        }
        const products = await this.Product.find(query).sort({ createdAt: -1 }).limit(10).exec();
        return products;
    }


    async getProductCount(websiteKey: string, vendorId: string) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const query = { websiteKey }
        if (vendorId) {
            query['vendor'] = new mongoose.Types.ObjectId(vendorId)
        }

        const productCount = await this.Product.countDocuments(query)

        return productCount;
    }


    async searchProduct(websiteKey: string, { query, sortBy, lastId, lastScore }: SearchProductQueryDto) {

        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const pipeline: mongoose.PipelineStage[] = [];

        /////////////////////////////////////////
        // Match stage first
        /////////////////////////////////////////

        pipeline.push({
            $match: { websiteKey: websiteKey }
        });

        /////////////////////////////////////////
        // Match stage second
        /////////////////////////////////////////

        const matchStage: Record<string, any> = {};

        matchStage.$text = {
            $search: query
        };
        pipeline.push({
            $match: matchStage
        });

        /////////////////////////////////////////
        // Adding score field
        /////////////////////////////////////////
        const addFieldsStage: Record<string, any> = {
            score: { $meta: "textScore" }
        }
        pipeline.push({
            $addFields: addFieldsStage
        });

        /////////////////////////////////////////
        // Pagination Match stage
        // Filters out previously fetched documents
        /////////////////////////////////////////
        if (lastId && lastScore) {
            const paginationMatchStage: Record<string, any> = {};
            if (sortBy == SearchProductSortByEnum.RELEVANCY) {
                paginationMatchStage.$or = [
                    { score: { $lt: lastScore } },
                    {
                        score: lastScore,
                        _id: { $lt: mongoose.Types.ObjectId.createFromHexString(lastId) }
                    }
                ];
            } else {
                paginationMatchStage._id = { $lt: mongoose.Types.ObjectId.createFromHexString(lastId) }
            }

            pipeline.push({
                $match: paginationMatchStage
            })
        }

        /////////////////////////////////////////
        // Sort stage
        /////////////////////////////////////////
        let sortStage: Record<string, 1 | -1> = {};
        if (sortBy == SearchProductSortByEnum.RELEVANCY) {
            sortStage = { score: -1, _id: -1 }
        } else {
            sortStage = { _id: -1 }
        }

        pipeline.push({
            $sort: sortStage
        });

        /////////////////////////////////////////
        // limit stage
        /////////////////////////////////////////
        pipeline.push({
            $limit: this.PRODUCT_BATCH_LIMIT
        });

        // Execute the aggregation pipeline
        const posts = await this.Product.aggregate(pipeline).exec();
        return posts;

    }

    async getProductById(websiteKey: string, productId: string, status: ProductStatusEnum, isDeleted: boolean) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const result = await this.Product.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(productId),
                    websiteKey: websiteKey,
                    ...(status !== undefined && { status }),
                    ...(isDeleted !== undefined && { isDeleted }),
                },
            },
        ]).exec();

        const product = result[0];
        // console.log(product, "Porudct")

        if (!product) {
            throw new NotFoundException('Product not found')
        }

        return product;
    }

    async getPublicProductById(websiteKey: string, productId: string) {
        const product = await this.getProductById(websiteKey, productId, ProductStatusEnum.PUBLISHED, false);
        return product;
    }

    async getAnyProductById(websiteKey: string, productId: string, userId: string, userRole: UserRoleEnum) {
        const product = await this.getProductById(websiteKey, productId, undefined, undefined);

        if (userId && userRole) {
            if (userRole === UserRoleEnum.CONTRIBUTOR && userId !== product.vendor.toString()) {
                throw new ForbiddenException();
            }
        }
        return product;
    }

    async updateProduct(websiteKey: string, productId: string, productDetail: UpdateProductDto, userId: string, userRole: UserRoleEnum) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const product = await this.Product.findOne({ _id: productId, websiteKey }, { vendor: 1 }).lean().exec();
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (userRole == UserRoleEnum.CONTRIBUTOR) {

            if (userId != product.vendor.toString()) {
                throw new ForbiddenException();
            }

            if (productDetail.status == ProductStatusEnum.PUBLISHED) {
                productDetail.status = ProductStatusEnum.AWAITING_APPROVAL;
            }
        }

        const query = await this.Product.updateOne({ _id: productId }, { $set: { ...productDetail, isDeleted: false } }).exec();
    }

    async getVariant(websiteKey: string, userId: string, userRole: UserRoleEnum, productId: string, variantId: string) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey);
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const product = await this.Product.findOne({ _id: productId, websiteKey }).exec();

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (userRole === UserRoleEnum.CONTRIBUTOR && userId !== product.vendor.toString()) {
            throw new ForbiddenException();
        }

        const variantIndex = product.variants.findIndex((variant) => variant.variantId === variantId);
        if (variantIndex === -1) {
            throw new NotFoundException(`Variant not found`);
        }
        const variant = product.variants[variantIndex]

        return variant;
    }

    async addVariant(websiteKey: string, userId: string, userRole: UserRoleEnum, productId: string, newVariant: CreateVariantDto) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const product = await this.Product.findOne({ _id: productId, websiteKey });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (userRole === UserRoleEnum.CONTRIBUTOR && userId !== product.vendor.toString()) {
            throw new ForbiddenException();
        }

        // Validate the uniqueness of the new variant within the product's variants
        const isVariantIdDuplicate = product.variants.some((variant) => variant.variantId === newVariant.variantId,);
        if (isVariantIdDuplicate) {
            throw new ConflictException(`Variant ID already exists in this product.`);
        }

        const conflict = await this.Product.findOne({
            vendor: product.vendor,
            websiteKey,
            'variants.sku': { $in: newVariant.sku },
        });

        if (conflict) {
            throw new ConflictException('One or more SKUs are already registered with this vendor');
        }

        product.variants.push(newVariant);

        await product.save();
    }

    async updateVariant(websiteKey: string, userId: string, userRole: UserRoleEnum, productId: string, variantId: string, variantDetails: UpdateVariantDto) {
        try {
            const website = await this.websiteService.getWebsiteByKey(websiteKey)
            if (!website) {
                throw new BadRequestException('Invalid website key')
            }

            const product = await this.Product.findOne({ _id: productId, websiteKey });

            if (!product) {
                throw new NotFoundException('Product not found');
            }

            if (userRole === UserRoleEnum.CONTRIBUTOR && userId !== product.vendor.toString()) {
                throw new ForbiddenException();
            }

            // Find the variant to update
            const variantIndex = product.variants.findIndex((variant) => variant.variantId === variantId,);
            if (variantIndex === -1) {
                throw new NotFoundException(`Variant not found`);
            }

            // Update the variant with the new details
            product.variants[variantIndex] = {
                ...product.variants[variantIndex]._doc,
                ...variantDetails,
                isDeleted: false
            };

            await product.save();
        } catch (error) {
            throw error;
        }
    }

    async deleteVariant(websiteKey: string, userId: string, userRole: UserRoleEnum, productId: string, variantId: string) {
        try {
            const website = await this.websiteService.getWebsiteByKey(websiteKey)
            if (!website) {
                throw new BadRequestException('Invalid website key')
            }

            const product = await this.Product.findOne({ _id: productId, websiteKey });

            if (!product) {
                throw new NotFoundException('Product not found');
            }

            if (userRole === UserRoleEnum.CONTRIBUTOR && userId !== product.vendor.toString()) {
                throw new ForbiddenException();
            }

            const unDeletedVariant = product.variants.filter((variant: any) => !variant.isDeleted)
            if (unDeletedVariant.length <= 1) {
                throw new BadRequestException('At least one product variant must remain.')
            }

            // Find the variant to update
            const variantIndex = product.variants.findIndex((variant) => variant.variantId === variantId);
            if (variantIndex === -1) {
                throw new NotFoundException(`Variant not found`);
            }

            if (product.variants[variantIndex].isDeleted) {
                throw new BadRequestException('Variant already deleted');
            }

            product.variants[variantIndex].isDeleted = true;

            product.save();
        } catch (error) {
            throw error;
        }
    }

    async recoverVariant(websiteKey: string, productId: string, variantId: string) {
        try {
            const website = await this.websiteService.getWebsiteByKey(websiteKey)
            if (!website) {
                throw new BadRequestException('Invalid website key')
            }

            const product = await this.Product.findOne({ _id: productId, websiteKey });

            if (!product) {
                throw new NotFoundException('Product not found');
            }

            const variantIndex = product.variants.findIndex((variant) => variant.variantId === variantId);

            if (variantIndex === -1) {
                throw new NotFoundException('Variant not found');
            }

            product.variants[variantIndex].isDeleted = false;

            product.save();

        } catch (error) {
            throw error;
        }
    }

    async changeProductStatus(websiteKey: string, productId: string, newStatus: ProductStatusEnum) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const query = await this.Product.updateOne({ _id: productId, websiteKey }, { $set: { status: newStatus } }).exec();
        if (query.matchedCount === 0) {
            throw new NotFoundException('Product not found');
        }
    }

    async deleteProduct(websiteKey: string, productId: string, userId: string, userRole: UserRoleEnum) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey);
        if (!website) {
            throw new BadRequestException('Invalid website key');
        }

        const product = await this.Product.findOne({ _id: productId, websiteKey }, { vendor: 1 });
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (userRole === UserRoleEnum.CONTRIBUTOR && userId !== product.vendor.toString()) {
            throw new ForbiddenException();
        }

        await this.Product.updateOne({ _id: productId }, { isDeleted: true });
    }

    async recoverProduct(websiteKey: string, productId: string) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey);
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const product = await this.Product.findOneAndUpdate({ _id: productId, websiteKey }, { isDeleted: false });

        if (!product) {
            throw new NotFoundException('Product not found');
        }
    }

    async updateVariantQuantity(websiteKey: string, productId: string, variantId: string, value: number) {

        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if (!website) {
            throw new BadRequestException('Invalid website key')
        }

        const product = await this.Product.findOne({ _id: productId, websiteKey }).exec();

        const variantIndex = product.variants.findIndex((variant) => variant.variantId === variantId);
        if (variantIndex === -1) {
            throw new NotFoundException(`Variant not found`);
        }

        product.variants[variantIndex].quantity += value;
        await product.save();
    }
}