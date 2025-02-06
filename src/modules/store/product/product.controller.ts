import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ProductService } from "./product.service";
import { AllowedStoreRoles } from "src/common/decorators/allowed-roles.decorator";
import { UserStoreRoleEnum } from "src/modules/users/schema/user.schema";
import { AuthGuard } from "src/modules/auth/auth.guard";
import { RolesGuard, StoreRolesGuard } from "src/modules/auth/role.guard";
import { CreateProductDto, CreateVariantDto } from "./dto/create-product-dto";
import { ValidateId } from "src/common/pipes/validate-id.pipe";
import { UpdateProductDto, UpdateVariantDto } from "./dto/update-product-dto";
import { GetProductQueryDto, GetPublicProductQueryDto } from "./dto/get-product-dto";
import { ProductStatusEnum } from "./schema/product.schema";
import { query } from "express";
import { SearchProductQueryDto } from "./dto/search-product-dto";



@Controller('products')
export class PorductController {
    constructor(private readonly productService: ProductService) { }


    @Post()
    @AllowedStoreRoles(UserStoreRoleEnum.VENDOR, UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async createProduct(@Body() productDetail: CreateProductDto, @Req() req: Request) {
        const user = (req as any).user;
        await this.productService.createProduct(productDetail, user._id, user.storeRole);
        return { message: "Product create successfully" }
    }


    @Get('public')
    async getPublicProduct(@Query() query: GetPublicProductQueryDto) {
        const products = await this.productService.getProducts(
            ProductStatusEnum.PUBLISHED,
            false,
            query.userId,
            query.categoryId,
            query.sortBy,
            query.lastId,
            query.searchQuery,
            query.website
        );

        return products;
    }

    @Get('search')
    async searchProduct(@Query() query: SearchProductQueryDto) {
        const produts = await this.productService.searchProduct(query);
        return produts;
    }

    @Get('public/:id')
    async getPublicProductById(@Param('id', ValidateId) productId: string, @Query() query: GetPublicProductQueryDto) {
        const product = await this.productService.getPublicProductById(productId, query.website);
        return product;
    }

    @Get('my')
    @AllowedStoreRoles(UserStoreRoleEnum.VENDOR, UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async getMyAllPorduct(@Req() req: Request, @Query() query: GetProductQueryDto) {
        const userId = (req as any).user._id;
        const products = await this.productService.getProducts(
            query.status,
            false,
            userId,
            query.categoryId,
            query.sortBy,
            query.lastId,
            query.searchQuery
        )

        return products;
    }

    @Get('my/delete')
    @AllowedStoreRoles(UserStoreRoleEnum.VENDOR, UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async getMyDeleted(@Req() req: Request, @Query() query: GetProductQueryDto) {
        const userId = (req as any).user._id;
        const products = await this.productService.getProducts(
            query.status,
            true,
            userId,
            query.categoryId,
            query.sortBy,
            query.lastId,
            query.searchQuery
        );

        return products
    }

    @Get('all')
    @AllowedStoreRoles(UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async getAllPorduct(@Query() query: GetProductQueryDto) {
        const products = await this.productService.getProducts(
            query.status,
            false,
            query.userId,
            query.categoryId,
            query.sortBy,
            query.lastId,
            query.searchQuery
        );
        return products;
    }

    @Get('all/delete')
    @AllowedStoreRoles(UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async getAllDeletedProduct(@Query() query: GetProductQueryDto) {
        const products = await this.productService.getProducts(
            query.status,
            true,
            query.userId,
            query.categoryId,
            query.sortBy,
            query.lastId,
            query.searchQuery
        )
        return products;
    }


    @Get(':id')
    @AllowedStoreRoles(UserStoreRoleEnum.VENDOR, UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async getProductById(@Param('id', ValidateId) productId: string, @Req() req: Request) {
        const user = (req as any).user;
        const product = await this.productService.getAnyProductById(productId, user._id, user.storeRole)
        return product;
    }



    @Patch('approve/:id')
    @AllowedStoreRoles(UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async approveProduct(@Param('id', ValidateId) productId: string) {
        await this.productService.changeProductStatus(productId, ProductStatusEnum.PUBLISHED)
        return { message: "Product published successfully" }
    }

    @Patch('reject/:id')
    @AllowedStoreRoles(UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async rejectProduct(@Param('id', ValidateId) productId: string) {
        await this.productService.changeProductStatus(productId, ProductStatusEnum.REJECTED)
        return { message: "Product rejected successfully" }
    }


    @Put(':id')
    @AllowedStoreRoles(UserStoreRoleEnum.VENDOR, UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async updateProduct(@Req() req: Request, @Param('id', ValidateId) porductId: string, @Body() productDetails: UpdateProductDto) {
        const user = (req as any).user;
        await this.productService.updateProduct(porductId, productDetails, user._id, user.storeRole)
        return { message: "Product update successfully" }
    }

    @Delete('delete/:id')
    @AllowedStoreRoles(UserStoreRoleEnum.VENDOR, UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async deleteProduct(@Param('id', ValidateId) productId: string, @Req() req: Request) {
        const user = (req as any).user;
        await this.productService.deleteProduct(productId, user._id, user.storeRole);
        return { message: "Product delete successfully" }
    }

    @Patch('recover/:id')
    @AllowedStoreRoles(UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async recoverProduct(@Param('id', ValidateId) productId: string) {
        await this.productService.recoverProduct(productId);
        return { message: "Product recover successfully" }
    }

    @Get('variant/:productId/:variantId')
    @UseGuards(AuthGuard)
    async getProductVariant(@Req() req: Request, @Param('productId', ValidateId) productId: string, @Param('variantId') variantId: string) {
        const user = (req as any).user
        const variant = await this.productService.getVariant(user._id, user.storeRole, productId, variantId)
        return variant;
    }

    @Post('variant/:id')
    @AllowedStoreRoles(UserStoreRoleEnum.VENDOR, UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async addVariant(@Req() req: Request, @Param('id', ValidateId) productId: string, @Body() newVariant: CreateVariantDto) {
        const user = (req as any).user;
        await this.productService.addVariant(user._id, user.storeRole, productId, newVariant);
        return { message: "Variant add successfully" }
    }

    @Patch('variant/:productId/:variantId')
    @AllowedStoreRoles(UserStoreRoleEnum.VENDOR, UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async updateVariant(
        @Req() req: Request,
        @Param('productId', ValidateId) productId: string,
        @Param('variantId') variantId: string,
        @Body() variantDetails: UpdateVariantDto
    ) {
        const user = (req as any).user;
        await this.productService.updateVariant(user._id, user.storeRole, productId, variantId, variantDetails)
        return { message: "Variant updated successfully" }
    }

    @Delete('variant/:productId/:variantId')
    @AllowedStoreRoles(UserStoreRoleEnum.VENDOR, UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async deleteVariant(
        @Req() req: Request,
        @Param('productId', ValidateId) productId: string,
        @Param('variantId') variantId: string,
    ) {
        const user = (req as any).user;
        await this.productService.deleteVariant(user._id, user.storeRole, productId, variantId)
        return { message: "Variant deleted successfully" }
    }

    @Patch('variant/recover/:productId/:variantId')
    @AllowedStoreRoles(UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async recoverVariant(
        @Param('productId', ValidateId) productId: string,
        @Param('variantId') variantId: string,
    ) {
        await this.productService.recoverVariant(productId, variantId)
        return { message: "Variant recover successfully" }
    }


}