import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ProductService } from "./product.service";
import { AllowedStoreRoles } from "src/common/decorators/allowed-roles.decorator";
import { UserStoreRoleEnum } from "src/modules/users/schema/user.schema";
import { AuthGuard } from "src/modules/auth/auth.guard";
import { RolesGuard, StoreRolesGuard } from "src/modules/auth/role.guard";
import { CreateProductDto } from "./dto/create-product-dto";
import { ValidateId } from "src/common/pipes/validate-id.pipe";
import { UpdateProductDto } from "./dto/update-product-dto";
import { GetProductQueryDto } from "./dto/get-product-dto";
import { ProductStatusEnum } from "./schema/product.schema";
import { query } from "express";



@Controller()
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
    async getPublicProduct(@Query() query: GetProductQueryDto) {
        const products = await this.productService.getProducts(
            ProductStatusEnum.PUBLISHED,
            false,
            query.userId,
            query.categoryId,
            query.sortBy,
            query.lastId,
            query.searchQuery
        );

        return products;
    }

    @Get('public/:id')
    async getPublicProductById(@Param('id', ValidateId) productId: string) {
        const product = await this.productService.getPublicProductById(productId);
        return product;
    }

    @Get('my')
    @AllowedStoreRoles(UserStoreRoleEnum.VENDOR, UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async getMyAllPorduct(@Req() req: Request, @Query() query: GetProductQueryDto){
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
    async getMyDeleted(@Req() req: Request, @Query() query: GetProductQueryDto){
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
    async getAllPorduct(@Query() query: GetProductQueryDto){
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
    async getAllDeletedProduct(@Query() query: GetProductQueryDto){
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
    async getProductById(@Param('id', ValidateId) productId: string){
     const product = await this.productService.getAnyProductById(productId)
     return product;   
    }


    @Put(':id')
    @AllowedStoreRoles(UserStoreRoleEnum.VENDOR, UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async updateProduct(@Req() req: Request, @Param('id', ValidateId) porductId: string, @Body() productDetails: UpdateProductDto) {
        const user = (req as any).user;
        await this.productService.updateProduct(porductId, productDetails, user._id, user.storeRole)
        return { message: "Product update successfully" }
    }

    // @Patch('')

}