import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { IProduct, ProductStatusEnum } from "./schema/product.schema";
import { CreateProductDto, CreateVariantDto } from "./dto/create-product-dto";
import { UserStoreRoleEnum } from "src/modules/users/schema/user.schema";
import { UpdateProductDto, UpdateVariantDto } from "./dto/update-product-dto";
import { ProductCategoriesService } from "../productCategories/productCategories.service";
import { ProductSortByEnum } from "./dto/get-product-dto";
import { generateSku } from "src/utils/helperFunctions";
import { SearchProductQueryDto, SearchProductSortByEnum } from "./dto/search-product-dto";




@Injectable()
export class ProductService {

    private readonly PRODUCT_BATCH_LIMIT = 20

    constructor(
        @InjectModel('Product') private Product: Model<IProduct>,
        private readonly productCategoryService: ProductCategoriesService
    ) { }



    async createProduct(newProductDetail: CreateProductDto, userId: string, userStoreRole: string) {
        const newProduct = new this.Product(newProductDetail);
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
            'variants.sku': { $in: skus },
        });

        if (conflict) {
            throw new ConflictException('One or more SKUs are already registered with this vendor');
        }


        // If vendor creates a product to be published, change its status to 'awaiting approval'
        if (userStoreRole === UserStoreRoleEnum.VENDOR && (newProduct.status === ProductStatusEnum.PUBLISHED)) {
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
        status: ProductStatusEnum,
        isDeleted: boolean,
        userId: string,
        categoryId: string,
        sortBy: string,
        lastId: string,
        searchQuery?: string,
    ) {

        const pipeline: mongoose.PipelineStage[] = [];

        /////////////////////////////////////////
        // Match stage
        /////////////////////////////////////////
        const matchStage: Record<string, any> = {};

        if (status) {
            matchStage.status = status;
        } else {
            matchStage.status = { $ne: ProductStatusEnum.DRAFT }
        }

        if (typeof isDeleted !== 'undefined') {
            matchStage.isDeleted = isDeleted;
        }

        if (userId) {
            matchStage.vendor = mongoose.Types.ObjectId.createFromHexString(userId);
        }

        if (categoryId) {
            matchStage.category = mongoose.Types.ObjectId.createFromHexString(categoryId);
        }

        // Add text search condition if searchQuery is provided
        if (searchQuery) {
            matchStage.$text = { $search: searchQuery };
        }

        switch (sortBy) {
            case ProductSortByEnum.OLDEST:
                if (lastId) {
                    matchStage._id = { $gt: mongoose.Types.ObjectId.createFromHexString(lastId) };
                }
                break;

            case ProductSortByEnum.RECENT:
                if (lastId) {
                    matchStage._id = { $lt: mongoose.Types.ObjectId.createFromHexString(lastId) };
                }
                break;

            // case ProductSortByEnum.POPULAR:
            //     if (lastLikesCount && lastId) {
            //         matchStage.$or = [
            //             { likesCount: { $lt: lastLikesCount } },
            //             {
            //                 likesCount: lastLikesCount,
            //                 _id: { $lt: mongoose.Types.ObjectId.createFromHexString(lastId) }
            //             }
            //         ];
            //     }
            //     break;
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
            { $unwind: '$vendor' },
            // Populate category
            {
                $lookup: {
                    from: 'productcategories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            { $unwind: '$category' }
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

            // case PostSortByEnum.POPULAR:
            //     // Order of insertion is important here. Since sorting order will be based on insertion order
            //     sortStage.likesCount = -1;
            //     sortStage._id = -1;
            //     break;
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

        /////////////////////////////////////////
        // Finals steps (Lookup and projection)
        /////////////////////////////////////////
        // pipeline.push(...this.postAggregationFinalSteps);


        // Execute the aggregation pipeline
        try {
            const products = await this.Product.aggregate(pipeline).exec();
            return products;
        } catch (error) {
            console.error('Error executing aggregation pipeline:', error);
            throw new Error('Failed to fetch products');
        }


    }

    async searchProduct({ query, sortBy, lastId, lastScore }: SearchProductQueryDto) {
        const pipeline: mongoose.PipelineStage[] = [];

        /////////////////////////////////////////
        // Match stage
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

    async getProductById(productId: string, status: ProductStatusEnum, isDeleted: boolean) {

        const result = await this.Product.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId.createFromHexString(productId),
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

    async getPublicProductById(productId: string) {
        const product = await this.getProductById(productId, ProductStatusEnum.PUBLISHED, false);
        return product;
    }

    async getAnyProductById(productId: string, userId: string, userStoreRole: UserStoreRoleEnum) {
        const product = await this.getProductById(productId, undefined, undefined);

        if (userId && userStoreRole) {
            if (userStoreRole === UserStoreRoleEnum.VENDOR && userId !== product.vendor.toString()) {
                throw new ForbiddenException();
            }
        }
        return product;
    }

    async updateProduct(productId: string, productDetail: UpdateProductDto, userId: string, userStoreRole: UserStoreRoleEnum) {
        const product = await this.Product.findOne({ _id: productId }, { vendor: 1 }).lean().exec();
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (userStoreRole == UserStoreRoleEnum.VENDOR) {

            if (userId != product.vendor.toString()) {
                throw new ForbiddenException();
            }

            if (productDetail.status == ProductStatusEnum.PUBLISHED) {
                productDetail.status = ProductStatusEnum.AWAITING_APPROVAL;
            }
        }

        const query = await this.Product.updateOne({ _id: productId }, { $set: productDetail }).exec();
    }

    async addVariant(userId: string, userStoreRole: UserStoreRoleEnum, productId: string, newVariant: CreateVariantDto) {
        const product = await this.Product.findById(productId);

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (userStoreRole === UserStoreRoleEnum.VENDOR && userId !== product.vendor.toString()) {
            throw new ForbiddenException();
        }

        // Validate the uniqueness of the new variant within the product's variants
        const isVariantIdDuplicate = product.variants.some((variant) => variant.variantId === newVariant.variantId,);
        if (isVariantIdDuplicate) {
            throw new ConflictException(`Variant ID already exists in this product.`);
        }

        const conflict = await this.Product.findOne({
            vendor: product.vendor,
            'variants.sku': { $in: newVariant.sku },
        });

        if (conflict) {
            throw new ConflictException('One or more SKUs are already registered with this vendor');
        }

        product.variants.push(newVariant);

        await product.save();
    }

    async updateVariant(userId: string, userStoreRole: UserStoreRoleEnum, productId: string, variantId: string, variantDetails: UpdateVariantDto) {
        try {
            const product = await this.Product.findById(productId);

            if (!product) {
                throw new NotFoundException('Product not found');
            }

            if (userStoreRole === UserStoreRoleEnum.VENDOR && userId !== product.vendor.toString()) {
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
            };

            await product.save();
        } catch (error) {
            throw error;
        }
    }

    async deleteVariant(userId: string, userStoreRole: UserStoreRoleEnum, productId: string, variantId: string) {
        try {
            const product = await this.Product.findById(productId);

            if (!product) {
                throw new NotFoundException('Product not found');
            }

            if (userStoreRole === UserStoreRoleEnum.VENDOR && userId !== product.vendor.toString()) {
                throw new ForbiddenException();
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

    async recoverVariant(productId: string, variantId: string) {
        try {
            const product = await this.Product.findById(productId);

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

    async changeProductStatus(productId: string, newStatus: ProductStatusEnum) {
        const query = await this.Product.updateOne({ _id: productId }, { $set: { status: newStatus } }).exec();
        if (query.matchedCount === 0) {
            throw new NotFoundException('Product not found');
        }
    }

    async deleteProduct(productId: string, userId: string, userStoreRole: string) {
        const product = await this.Product.findOne({ _id: productId }, { vendor: 1 });
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (userStoreRole === UserStoreRoleEnum.VENDOR && userId !== product.vendor.toString()) {
            throw new ForbiddenException()
        }

        await this.Product.updateOne({ _id: productId }, { isDeleted: true });
    }

    async recoverProduct(productId: string) {
        const product = await this.Product.findOneAndUpdate({ _id: productId }, { isDeleted: false });

        if (!product) {
            throw new NotFoundException('Product not found');
        }
    }
}