import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ProductService } from "./product.service";
import { AllowedRoles } from "src/common/decorators/allowed-roles.decorator";
import { UserRoleEnum } from "src/modules/users/schema/user.schema";
import { AuthGuard } from "src/modules/auth/auth.guard";
import { RolesGuard } from "src/modules/auth/role.guard";
import { CreateProductDto, CreateVariantDto } from "./dto/create-product-dto";
import { ValidateId } from "src/common/pipes/validate-id.pipe";
import { UpdateProductDto, UpdateVariantDto } from "./dto/update-product-dto";
import { GetProductQueryDto, GetPublicProductQueryDto } from "./dto/get-product-dto";
import { ProductStatusEnum } from "./schema/product.schema";
import { SearchProductQueryDto } from "./dto/search-product-dto";



@Controller('products')
export class PorductController {
    constructor(private readonly productService: ProductService) { }


    @Post()
    @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async createProduct(
        @Headers('websiteKey') websiteKey: string,
        @Body() productDetail: CreateProductDto,
        @Req() req: Request
    ) {
        const user = (req as any).user;
        await this.productService.createProduct(websiteKey, productDetail, user._id, user.role);
        return { message: "Product create successfully" }
    }


    @Get('public')
    async getPublicProduct(
        @Headers('websiteKey') websiteKey: string,
        @Query() query: GetPublicProductQueryDto
    ) {
        const products = await this.productService.getProducts(
            websiteKey,
            ProductStatusEnum.PUBLISHED,
            false,
            query.userId,
            query.categoryId,
            query.sortBy,
            query.lastId,
            query.searchQuery,
        );

        return products;
    }

    @Get('search')
    async searchProduct(
        @Headers('websiteKey') websiteKey: string,
        @Query() query: SearchProductQueryDto
    ) {
        const produts = await this.productService.searchProduct(websiteKey, query);
        return produts;
    }

    @Get('public/:id')
    async getPublicProductById(
        @Headers('websiteKey') websiteKey: string,
        @Param('id', ValidateId) productId: string,
        @Query() query: GetPublicProductQueryDto
    ) {
        const product = await this.productService.getPublicProductById(websiteKey, productId);
        return product;
    }

    @Get('my')
    @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async getMyAllPorduct(
        @Headers('websiteKey') websiteKey: string,
        @Req() req: Request,
        @Query() query: GetProductQueryDto
    ) {
        const userId = (req as any).user._id;
        const products = await this.productService.getProducts(
            websiteKey,
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
    @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async getMyDeleted(
        @Headers('websiteKey') websiteKey: string,
        @Req() req: Request,
        @Query() query: GetProductQueryDto
    ) {
        const userId = (req as any).user._id;
        const products = await this.productService.getProducts(
            websiteKey,
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
    @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async getAllPorduct(
        @Headers('websiteKey') websiteKey: string,
        @Query() query: GetProductQueryDto
    ) {
        const products = await this.productService.getProducts(
            websiteKey,
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
    @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async getAllDeletedProduct(
        @Headers('websiteKey') websiteKey: string,
        @Query() query: GetProductQueryDto
    ) {
        const products = await this.productService.getProducts(
            websiteKey,
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
    @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async getProductById(
        @Headers('websiteKey') websiteKey: string,
        @Req() req: Request,
        @Param('id', ValidateId) productId: string
    ) {
        const user = (req as any).user;
        const product = await this.productService.getAnyProductById(websiteKey, productId, user._id, user.role)
        return product;
    }



    @Patch('approve/:id')
    @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async approveProduct(
        @Headers('websiteKey') websiteKey: string,
        @Param('id', ValidateId) productId: string
    ) {
        await this.productService.changeProductStatus(websiteKey, productId, ProductStatusEnum.PUBLISHED)
        return { message: "Product published successfully" }
    }

    @Patch('reject/:id')
    @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async rejectProduct(
        @Headers('websiteKey') websiteKey: string,
        @Param('id', ValidateId) productId: string
    ) {
        await this.productService.changeProductStatus(websiteKey, productId, ProductStatusEnum.REJECTED)
        return { message: "Product rejected successfully" }
    }


    @Put(':id')
    @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async updateProduct(
        @Headers('websiteKey') websiteKey: string,
        @Req() req: Request,
        @Param('id', ValidateId) porductId: string,
        @Body() productDetails: UpdateProductDto
    ) {
        const user = (req as any).user;
        await this.productService.updateProduct(websiteKey, porductId, productDetails, user._id, user.storeRole)
        return { message: "Product update successfully" }
    }

    @Delete('delete/:id')
    @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async deleteProduct(
        @Headers('websiteKey') websiteKey: string,
        @Param('id', ValidateId) productId: string,
        @Req() req: Request
    ) {
        const user = (req as any).user;
        await this.productService.deleteProduct(websiteKey, productId, user._id, user.role);
        return { message: "Product delete successfully" }
    }

    @Patch('recover/:id')
    @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async recoverProduct(
        @Headers('websiteKey') websiteKey: string,
        @Param('id', ValidateId) productId: string
    ) {
        await this.productService.recoverProduct(websiteKey, productId);
        return { message: "Product recover successfully" }
    }

    @Get('variant/:productId/:variantId')
    @UseGuards(AuthGuard)
    async getProductVariant(
        @Headers('websiteKey') websiteKey: string,
        @Req() req: Request,
        @Param('productId', ValidateId) productId: string,
        @Param('variantId') variantId: string
    ) {
        const user = (req as any).user
        const variant = await this.productService.getVariant(websiteKey, user._id, user.role, productId, variantId)
        return variant;
    }

    @Post('variant/:id')
    @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async addVariant(
        @Headers('websiteKey') websiteKey: string,
        @Req() req: Request,
        @Param('id', ValidateId) productId: string,
        @Body() newVariant: CreateVariantDto
    ) {
        const user = (req as any).user;
        await this.productService.addVariant(websiteKey, user._id, user.role, productId, newVariant);
        return { message: "Variant add successfully" }
    }

    @Patch('variant/:productId/:variantId')
    @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async updateVariant(
        @Headers('websiteKey') websiteKey: string,
        @Req() req: Request,
        @Param('productId', ValidateId) productId: string,
        @Param('variantId') variantId: string,
        @Body() variantDetails: UpdateVariantDto
    ) {
        const user = (req as any).user;
        await this.productService.updateVariant(websiteKey, user._id, user.role, productId, variantId, variantDetails)
        return { message: "Variant updated successfully" }
    }

    @Delete('variant/:productId/:variantId')
    @AllowedRoles(UserRoleEnum.CONTRIBUTOR, UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async deleteVariant(
        @Headers('websiteKey') websiteKey: string,
        @Req() req: Request,
        @Param('productId', ValidateId) productId: string,
        @Param('variantId') variantId: string,
    ) {
        const user = (req as any).user;
        await this.productService.deleteVariant(websiteKey, user._id, user.role, productId, variantId)
        return { message: "Variant deleted successfully" }
    }

    @Patch('variant/recover/:productId/:variantId')
    @AllowedRoles(UserRoleEnum.MODERATOR, UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async recoverVariant(
        @Headers('websiteKey') websiteKey: string,
        @Param('productId', ValidateId) productId: string,
        @Param('variantId') variantId: string,
    ) {
        await this.productService.recoverVariant(websiteKey, productId, variantId)
        return { message: "Variant recover successfully" }
    }

}