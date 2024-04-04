import { CustomError } from './../../domain/errors/custom.error';
import { CategoryModel } from '../../data';
import { CreateCategoryDto, UserEntity, PaginationDto } from '../../domain';

export class CategoryService {
  constructor() {}

  async createCategory(cerateCategoryDto: CreateCategoryDto, user: UserEntity) {
    const categoryExists = await CategoryModel.findOne({
      name: cerateCategoryDto.name,
    });

    if (categoryExists) throw CustomError.badRequest('Category already exists');

    try {
      const category = new CategoryModel({
        ...cerateCategoryDto,
        user: user.id,
      });

      await category.save();

      return {
        id: category.id,
        name: category.name,
        available: category.available,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getCategories(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {    
      const [categories, total] = await Promise.all([
        CategoryModel.find()
        .skip((page - 1) * limit)
        .limit(limit),
        CategoryModel.countDocuments()
      ])

      return {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
        categories:  categories.map((category) => ({
          id: category.id,
          name: category.name,
          available: category.available,
        }))
      };

    } catch (error) {
      throw CustomError.internalServer();
    }
  }
}
