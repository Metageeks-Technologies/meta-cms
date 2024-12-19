import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AllowedRoles } from 'src/decorators/allowed-roles.decorator';
import { UserRoleEnum } from '../users/schema/user.schema';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { ValidateId } from 'src/pipes/validate-id.pipe';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @AllowedRoles(UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async create(@Body() newCategoryData: CreateCategoryDto) {
    await this.categoriesService.create(newCategoryData);
    return { message: "Category created successfully" };
  }

  @Get()
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return categories;
  }

  @Get(':id')
  async findById(@Param('id', ValidateId) id: string) {
    const category = await this.categoriesService.findById(id);
    return category;
  }

  @Patch(':id')
  @AllowedRoles(UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async updateById(@Param('id', ValidateId) id: string, @Body() updatedCategoryData: UpdateCategoryDto) {
    await this.categoriesService.updateById(id, updatedCategoryData);
    return { message: "Category updated successfully" };
  }

  @Delete(':id')
  @AllowedRoles(UserRoleEnum.SUPERADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async deleteById(@Param('id', ValidateId) id: string) {
    await this.categoriesService.deleteById(id);
    return { message: "Category deleted successfully" };
  }
}
