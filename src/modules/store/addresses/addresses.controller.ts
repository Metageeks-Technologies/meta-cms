import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AddressService } from "./addresses.service";
import { AuthGuard } from "src/modules/auth/auth.guard";
import { CreateAddressDto } from "./dto/create-address-dto";
import { ValidateId } from "src/common/pipes/validate-id.pipe";
import { UpdateAddressDto } from "./dto/update-address-dto";
import { RolesGuard } from "src/modules/auth/role.guard";
import { AllowedRoles } from "src/common/decorators/allowed-roles.decorator";
import { UserRoleEnum } from "src/modules/users/schema/user.schema";




@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) { }

    @Post()
    @UseGuards(AuthGuard)
    async newAddress(@Headers('websiteKey') websiteKey: string, @Req() req: Request, @Body() addressDetails: CreateAddressDto) {
        const user = (req as any).user;
        await this.addressService.create(websiteKey, user._id, addressDetails);
        return { message: "Address created successfully" }
    }

    @Get()
    @UseGuards(AuthGuard)
    async getUserAllAddress(@Headers('websiteKey') websiteKey: string, @Req() req: Request) {
        const userId = (req as any).user._id;
        const addresses = await this.addressService.getUserAllAddress(websiteKey, userId, false);
        return addresses;
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async getAddressById(@Headers('websiteKey') websiteKey: string, @Param('id', ValidateId) id: string, @Req() req: Request) {
        const user = (req as any).user;
        const address = await this.addressService.getAddressById(websiteKey, id, user._id, user.role);
        return address;
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    async updateAddress(
        @Headers('websiteKey') websiteKey: string,
        @Req() req: Request,
        @Param('id', ValidateId) addressId: string,
        @Body() addressDetails: UpdateAddressDto
    ) {
        const user = (req as any).user;
        await this.addressService.update(websiteKey, addressId, user._id, user.role, addressDetails);
        return { message: "Address update successfully" }
    }

    @Patch(':id')
    @UseGuards(AuthGuard)
    async setDefaultAddress(
        @Headers('websiteKey') websiteKey: string,
        @Req() req: Request,
        @Param('id', ValidateId) addressId: string
    ) {
        const user = (req as any).user;
        await this.addressService.markAsDefault(websiteKey, addressId, user._id, user.role);
        return { message: "Address mark as default" }
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async deleteAddress(
        @Headers('websiteKey') websiteKey: string,
        @Req() req: Request,
        @Param('id', ValidateId) addressId: string
    ) {
        const user = (req as any).user;
        await this.addressService.delete(websiteKey, addressId, user._id, user.role)
        return { message: "Address deleted successfully" }
    }

    @Get('all/:id')
    @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async userAllAddress(@Headers('websiteKey') websiteKey: string, @Param('id', ValidateId) userId: string) {
        const addresses = await this.addressService.getUserAllAddress(websiteKey, userId);
        return addresses
    }

    @Patch('recover/:id')
    @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    async recoverAddress(@Headers('websiteKey') websiteKey: string, @Param('id', ValidateId) addressId: string) {
        await this.addressService.recoverAddress(websiteKey, addressId);
        return { message: "Address recover successfully" }
    }

}