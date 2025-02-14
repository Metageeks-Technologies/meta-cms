import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Headers } from '@nestjs/common';
import { AllowedRoles, AllowedStoreRoles } from 'src/common/decorators/allowed-roles.decorator';
import { UserRoleEnum, UserStoreRoleEnum } from '../../users/schema/user.schema';
import { AuthGuard } from '../../auth/auth.guard';
import { RolesGuard, StoreRolesGuard } from '../../auth/role.guard';
import { ValidateId } from 'src/common/pipes/validate-id.pipe';
import { ProductCategoriesService } from './productCategories.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';

@Controller('product-categories')
export class ProductCategoriesController {
  constructor(private readonly productCategoriesService: ProductCategoriesService) { }

  @Post()
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async create(@Headers('websiteKey') websiteKey: string, @Body() newCategoryData: CreateProductCategoryDto) {
    await this.productCategoriesService.create(websiteKey, newCategoryData);
    return { message: "Category created successfully" };
  }

  @Get()
  async findAll(@Headers('websiteKey') websiteKey: string) {
    const categories = await this.productCategoriesService.findAll(websiteKey);
    return categories;
  }

  @Get(':id')
  async findById(@Headers('websiteKey') websiteKey: string, @Param('id', ValidateId) id: string) {
    const category = await this.productCategoriesService.findById(websiteKey, id);
    return category;
  }

  @Patch(':id')
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async updateById(
    @Headers('websiteKey') websiteKey: string,
    @Param('id', ValidateId) id: string,
    @Body() updatedCategoryData: UpdateProductCategoryDto
  ) {
    await this.productCategoriesService.updateById(websiteKey, id, updatedCategoryData);
    return { message: "Category updated successfully" };
  }

  @Delete(':id')
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async deleteById(@Headers('websiteKey') websiteKey: string, @Param('id', ValidateId) id: string) {
    await this.productCategoriesService.deleteById(websiteKey, id);
    return { message: "Category deleted successfully" };
  }
}
