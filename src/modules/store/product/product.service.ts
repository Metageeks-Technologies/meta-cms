import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { IProduct, ProductStatusEnum } from "./schema/product.schema";
import { CreateProductDto, CreateVariantDto } from "./dto/create-product-dto";
import { UserStoreRoleEnum } from "src/modules/users/schema/user.schema";
import { UpdateProductDto, UpdateVariantDto } from "./dto/update-product-dto";
import { ProductCategoriesService } from "../productCategories/productCategories.service";
import { ProductSortByEnum } from "./dto/get-product-dto";




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

        const category = await this.productCategoryService.findById(newProductDetail.category);

        newProduct.variants.forEach((variant, index) => {
            variant.sku = generateSku(category.code, newProduct.title, variant.variantId);
        });

        // If vendor creates a product to be published, change its status to 'awaiting approval'
        if (userStoreRole === UserStoreRoleEnum.VENDOR && (newProduct.status === ProductStatusEnum.PUBLISHED)) {
            newProduct.status = ProductStatusEnum.AWAITING_APPROVAL;
        }

        try {
            await newProduct.save();

        } catch (error) {
            throw error;
        }
    }

    async getProduct(
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

    async searchProduct() {

    }

    async getProductById(productId: string, status: string, isDeleted: boolean) {

        const result = await this.Product.aggregate([
            {
                $match: {
                    _id: productId,
                    ...(status && {status: status}),
                    ...(status && {isDeleted: isDeleted})
                }
            }
        ]).exec();

        const product = result[0];

        if(!product){
            throw new NotFoundException('Product not found')
        }
        return product;
    }

    async getPublicProductById(productId: string){
        const product = await this.getProductById(productId, ProductStatusEnum.PUBLISHED, false);
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

    async addVariant(productId: string, newVariant: CreateVariantDto) {
        const product = await this.Product.findById(productId);

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Validate the uniqueness of the new variant within the product's variants
        const isVariantIdDuplicate = product.variants.some((variant) => variant.variantId === newVariant.variantId,);
        if (isVariantIdDuplicate) {
            throw new ConflictException(`Variant ID already exists in this product.`);
        }

        const category = await this.productCategoryService.findById(product.category.toString());

        newVariant.sku = generateSku(category.code, product.title, newVariant.variantId);

        product.variants.push(newVariant);

        await product.save();
    }

    async updateVariant(productId: string, variantId: string, variantDetails: UpdateVariantDto) {
        try {
            const product = await this.Product.findById(productId);

            if (!product) {
                throw new NotFoundException('Product not found');
            }

            // Find the variant to update
            const variantIndex = product.variants.findIndex((variant) => variant.variantId === variantId,);
            if (variantIndex === -1) {
                throw new NotFoundException(`Variant not found`);
            }

            // Update the variant with the new details
            product.variants[variantIndex] = {
                ...product.variants[variantIndex],
                ...variantDetails,
            };

            await product.save();
        } catch (error) {
            throw error;
        }
    }

    async deleteVariant(productId: string, variantId: string) {
        try {
            const product = await this.Product.findById(productId);

            if (!product) {
                throw new NotFoundException('Product not found');
            }

            // Find the variant to update
            const variantIndex = product.variants.findIndex((variant) => variant.variantId === variantId);
            if (variantIndex === -1) {
                throw new NotFoundException(`Variant not found`);
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

    async deleteProduct(productId: string) {
        const product = await this.Product.findOneAndUpdate({ _id: productId }, { isDeleted: true });

        if (!product) {
            throw new NotFoundException('Product not found');
        }
    }

    async recoverProduct(productId: string) {
        const product = await this.Product.findOneAndUpdate({ _id: productId }, { isDeleted: false });

        if (!product) {
            throw new NotFoundException('Product not found');
        }
    }




}