import { Request, Response } from 'express';
import { CustomError, LoginUserDto, RegisterUserDto } from '../../domain';
import { AuthService } from '../services/auth.service';

export class AuthController  {
    constructor(
        public readonly authService: AuthService
    ) {}

    private handleErrors = (error: unknown, res: Response) => {
        if(error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(`[ERROR]: ${ error }`)
        return res.status(500).json({ message: 'Internal server error' });
    }

    registerUser = (req: Request, res: Response) => {
        const [error, dto] = RegisterUserDto.create(req.body);
        
        if(error) return res.status(400).json({ message: error });

        this.authService.registerUser(dto!)
        .then((user) => res.json(user))
        .catch((error) => this.handleErrors(error, res));

        
    }
    
    loginUser = (req: Request, res: Response) => {
        const [error, dto] = LoginUserDto.create(req.body);

        if(error) return res.status(400).json({ message: error });

        this.authService.loginUser(dto!)
        .then((user) => res.json(user))
        .catch((error) => this.handleErrors(error, res));
    }
    
    validateEmail = (req: Request, res: Response) => {
        res.json({ message: 'validate' });
    }
}