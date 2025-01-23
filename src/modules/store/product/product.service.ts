import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { IProduct, ProductStatusEnum } from "./schema/product.schema";
import { CreateProductDto, CreateVariantDto } from "./dto/create-product-dto";
import { UserStoreRoleEnum } from "src/modules/users/schema/user.schema";
import { UpdateProductDto, UpdateVariantDto } from "./dto/update-product-dto";
import { ProductCategoriesService } from "../productCategories/productCategories.service";




@Injectable()
export class ProductService {

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
        const product = await this.Product.findById(productId);

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Find the variant to update
        const variantIndex = product.variants.findIndex((variant) => variant.variantId === variantId,);
        if (variantIndex === -1) {
            throw new NotFoundException(`Variant not found`);
        }

    }


}