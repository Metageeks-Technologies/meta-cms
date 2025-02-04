import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AddressService } from "./addresses.service";
import { AuthGuard } from "src/modules/auth/auth.guard";
import { CreateAddressDto } from "./dto/create-address-dto";
import { ValidateId } from "src/common/pipes/validate-id.pipe";
import { UpdateAddressDto } from "./dto/update-address-dto";
import { StoreRolesGuard } from "src/modules/auth/role.guard";
import { AllowedStoreRoles } from "src/common/decorators/allowed-roles.decorator";
import { UserStoreRoleEnum } from "src/modules/users/schema/user.schema";




@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) { }

    @Post()
    @AllowedStoreRoles(UserStoreRoleEnum.USER, UserStoreRoleEnum.VENDOR, UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async newAddress(@Req() req: Request, @Body() addressDetails: CreateAddressDto) {
        const user = (req as any).user;
        await this.addressService.create(user._id, addressDetails);
        return { message: "Address created successfully" }
    }

    @Get()
    @AllowedStoreRoles(UserStoreRoleEnum.USER, UserStoreRoleEnum.VENDOR, UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async getUserAllAddress(@Req() req: Request) {
        const userId = (req as any).user._id;
        const addresses = await this.addressService.getUserAllAddress(userId, false);
        return addresses;
    }

    @Get(':id')
    @AllowedStoreRoles(UserStoreRoleEnum.USER, UserStoreRoleEnum.VENDOR, UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async getAddressById(@Param('id', ValidateId) id: string, @Req() req: Request) {
        const user = (req as any).user;
        const address = await this.addressService.getAddressById(id, user._id, user.storeRole);
        return address;
    }

    @Put(':id')
    @AllowedStoreRoles(UserStoreRoleEnum.USER, UserStoreRoleEnum.VENDOR, UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async updateAddress(
        @Req() req: Request,
        @Param('id', ValidateId) addressId: string,
        @Body() addressDetails: UpdateAddressDto
    ) {
        const user = (req as any).user;
        await this.addressService.update(addressId, user._id, user.storeRole, addressDetails);
        return { message: "Address update successfully" }
    }

    @Patch(':id')
    @AllowedStoreRoles(UserStoreRoleEnum.USER, UserStoreRoleEnum.VENDOR, UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async setDefaultAddress(@Req() req: Request, @Param('id', ValidateId) addressId: string) {
        const user = (req as any).user;
        await this.addressService.markAsDefault(addressId, user._id, user.storeRole);
        return { message: "Address mark as default" }
    }

    @Delete(':id')
    @AllowedStoreRoles(UserStoreRoleEnum.USER, UserStoreRoleEnum.VENDOR, UserStoreRoleEnum.MODERATOR, UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async deleteAddress(@Req() req: Request, @Param('id', ValidateId) addressId: string) {
        const user = (req as any).user;
        await this.addressService.delete(addressId, user._id, user.storeRole)
        return { message: "Address deleted successfully" }
    }

    @Get('/all/:id')
    @AllowedStoreRoles(UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async userAllAddress(@Param('id', ValidateId) userId: string) {
        const addresses = await this.addressService.getUserAllAddress(userId);
        return addresses
    }

    @Patch('recover/:id')
    @AllowedStoreRoles(UserStoreRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, StoreRolesGuard)
    async recoverAddress(@Param('id', ValidateId) addressId: string) {
        await this.addressService.recoverAddress(addressId);
        return { message: "Address recover successfully" }
    }

}