import { CategoryService } from './../services/category.service';
import { Request, Response } from 'express';
import { CreateCategoryDto, CustomError, PaginationDto } from '../../domain';

export class CategoryController { 
    constructor(
        private readonly categoryService: CategoryService
    ){}

    private handleErrors = (error: unknown, res: Response) => {
        if(error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(`[ERROR]: ${ error }`)
        return res.status(500).json({ message: 'Internal server error' });
    }

    createCategory = async (req: Request, res: Response) => {
        const [error, createCategoryDto] = CreateCategoryDto.create(req.body);

        if(error) return this.handleErrors(new CustomError(400, error), res);

        this.categoryService.createCategory(createCategoryDto!, req.body.user)
        .then((category) => res.status(201).json(category))
        .catch((error) => this.handleErrors(error, res));
    }

    getCategories = async (req: Request, res: Response) => {

        const { page = 1 , limit = 10 } = req.query;
        const [ error, paginationDto ] = PaginationDto.create(+page, +limit);
        if(error) return this.handleErrors(new CustomError(400, error), res);

        this.categoryService.getCategories(paginationDto!)
        .then((categories) => res.status(200).json(categories))
        .catch((error) => this.handleErrors(error, res));
    }
}