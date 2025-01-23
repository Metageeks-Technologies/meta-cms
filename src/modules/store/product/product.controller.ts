import { Body, Controller, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ProductService } from "./product.service";
import { AllowedStoreRoles } from "src/common/decorators/allowed-roles.decorator";
import { UserStoreRoleEnum } from "src/modules/users/schema/user.schema";
import { AuthGuard } from "src/modules/auth/auth.guard";
import { StoreRolesGuard } from "src/modules/auth/role.guard";
import { CreateProductDto } from "./dto/create-product-dto";
import { ValidateId } from "src/common/pipes/validate-id.pipe";
import { UpdateProductDto } from "./dto/update-product-dto";



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

    @Put(':id')
    @AllowedStoreRoles(UserStoreRoleEnum.VENDOR, UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async updateProduct(@Req() req: Request, @Param('id', ValidateId) porductId: string, @Body() productDetails: UpdateProductDto){
        const user = (req as any).user;
        await this.productService.updateProduct(porductId, productDetails, user._id, user.storeRole)
        return { message: "Product update successfully" }
    }

    // @Patch('')

}