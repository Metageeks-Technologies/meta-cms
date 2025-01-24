import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
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
  constructor(private readonly productCategoriesService: ProductCategoriesService) {}

  @Post()
  @AllowedStoreRoles(UserStoreRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, StoreRolesGuard)
  async create(@Body() newCategoryData: CreateProductCategoryDto) {
    await this.productCategoriesService.create(newCategoryData);
    return { message: "Category created successfully" };
  }

  @Get()
  async findAll() {
    const categories = await this.productCategoriesService.findAll();
    return categories;
  }

  @Get(':id')
  async findById(@Param('id', ValidateId) id: string) {
    const category = await this.productCategoriesService.findById(id);
    return category;
  }

  @Patch(':id')
  @AllowedStoreRoles(UserStoreRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, StoreRolesGuard)
  async updateById(@Param('id', ValidateId) id: string, @Body() updatedCategoryData: UpdateProductCategoryDto) {
    await this.productCategoriesService.updateById(id, updatedCategoryData);
    return { message: "Category updated successfully" };
  }

  @Delete(':id')
  @AllowedStoreRoles(UserStoreRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, StoreRolesGuard)
  async deleteById(@Param('id', ValidateId) id: string) {
    await this.productCategoriesService.deleteById(id);
    return { message: "Category deleted successfully" };
  }
}
