import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Headers, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AllowedRoles } from 'src/common/decorators/allowed-roles.decorator';
import { UserRoleEnum } from '../users/schema/user.schema';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { ValidateId } from 'src/common/pipes/validate-id.pipe';
import { CategoryQueryDto } from './dto/get-category-dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async create(@Headers('websiteKey') websiteKey: string, @Body() newCategoryData: CreateCategoryDto) {
    await this.categoriesService.create(websiteKey, newCategoryData);
    return { message: "Category created successfully" };
  }

  @Get()
  async findAll(
    @Headers('websiteKey') websiteKey: string,
    @Query() query: CategoryQueryDto
  ) {
    const categories = await this.categoriesService.findAll(websiteKey, query.page, query.search);
    return categories;
  }

  @Get(':id')
  async findById(@Headers('websiteKey') websiteKey: string, @Param('id', ValidateId) id: string) {
    const category = await this.categoriesService.findById(websiteKey, id);
    return category;
  }

  @Patch(':id')
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async updateById(@Headers('websiteKey') websiteKey: string, @Param('id', ValidateId) id: string, @Body() updatedCategoryData: UpdateCategoryDto) {
    await this.categoriesService.updateById(websiteKey, id, updatedCategoryData);
    return { message: "Category updated successfully" };
  }

  @Delete(':id')
  @AllowedRoles(UserRoleEnum.ADMIN, UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async deleteById(@Headers('websiteKey') websiteKey: string, @Param('id', ValidateId) id: string) {
    await this.categoriesService.deleteById(websiteKey, id);
    return { message: "Category deleted successfully" };
  }
}
