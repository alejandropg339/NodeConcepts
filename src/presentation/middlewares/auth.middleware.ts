import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '../../config';
import { UserModel } from '../../data';
import { UserEntity } from '../../domain';

export class AuthMiddleware {
    static async validateJWT(req: Request, res: Response, next: NextFunction) {
        try {
            const authorization = req.header('Authorization');
            
            const unauthorized = (code: string) => res.status(401).json({ message: 'Unauthorized', code });

            if(!authorization) return unauthorized('HEADER');

            if(!authorization.startsWith('Bearer ')) return unauthorized('BEARER');

            const token = authorization.split(' ').at(1) || '';

            const payload = await JwtAdapter.validateToken<{id: string}>(token);

            if(!payload) return unauthorized('ID');

            const user = await UserModel.findById(payload.id);

            if(!user) return unauthorized('USER_NOT_FOUND');

            req.body.user = UserEntity.fromObject(user);

            next();
        }
        catch (error) {
            console.log(`[ERROR]: ${ error }`)
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
} 