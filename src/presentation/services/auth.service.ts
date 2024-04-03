import { JwtAdapter, bcryptAdapter } from '../../config';
import { UserModel } from '../../data';
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from '../../domain';

export class AuthService {
    constructor() {}

    public async registerUser (registerUserDto: RegisterUserDto) {
        const existUser  = await UserModel.findOne({ email: registerUserDto.email });

        if (existUser) throw CustomError.badRequest('User already exist');

        try {
            const user = new UserModel(registerUserDto);
            
            // Encrypt password
            user.password = bcryptAdapter.hash(registerUserDto.password)
            
            await user.save();

            // JWT

            // Confirmation email

            const { password, ...rest } = UserEntity.fromObject(user)

            return { user: rest, token: 'token' };
        } catch (error) {
            throw CustomError.internalServer(`${ error }`);
        }
    }

    public async loginUser (loginUserDto: LoginUserDto) {
        const user  = await UserModel.findOne({ email: loginUserDto.email });

        const badRequestError = CustomError.badRequest('User or password wrong');

        if (!user) throw badRequestError

        const isMatch = bcryptAdapter.compare(loginUserDto.password, user.password);

        if (!isMatch) throw badRequestError

        const { password, ...rest } = UserEntity.fromObject(user)

        const token = await JwtAdapter.generateToken({ id: user.id })

        if(!token) throw CustomError.internalServer('Error generating token')

        return {
            user: rest,
            token
        }

        // JWT
    }
}