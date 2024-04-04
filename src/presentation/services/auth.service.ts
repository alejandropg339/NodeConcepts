import { JwtAdapter, bcryptAdapter, envs } from '../../config';
import { UserModel } from '../../data';
import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from '../../domain';
import { EmailService } from './email.service';

export class AuthService {
  constructor(private readonly emailService: EmailService) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });

    if (existUser) throw CustomError.badRequest('User already exist');

    try {
      const user = new UserModel(registerUserDto);

      // Encrypt password
      user.password = bcryptAdapter.hash(registerUserDto.password);

      await user.save();

      // Confirmation email
      this.sendEmailValidationLink(user.email);

      const { password, ...rest } = UserEntity.fromObject(user);

      // JWT
      const token = await JwtAdapter.generateToken({ id: user.id });

      if (!token) throw CustomError.internalServer('Error generating token');

      return { user: rest, token: token };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await UserModel.findOne({ email: loginUserDto.email });

    const badRequestError = CustomError.badRequest('User or password wrong');

    if (!user) throw badRequestError;

    const isMatch = bcryptAdapter.compare(loginUserDto.password, user.password);

    if (!isMatch) throw badRequestError;

    const { password, ...rest } = UserEntity.fromObject(user);

    const token = await JwtAdapter.generateToken({ id: user.id });

    if (!token) throw CustomError.internalServer('Error generating token');

    return {
      user: rest,
      token,
    };
  }

  private sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email });

    if (!token) throw CustomError.internalServer('Error generating token');

    const url = `${envs.WEB_SERVICE_URL}/auth/validate-email/${token}`;

    const html = `
        <h1>Validate your email</h1>
        <p>Click on the following link to validate your email</p>
        <a href="${url}">Validate your email: ${email}</a>`;

    const emailOptions = {
      to: email,
      subject: 'Validate your email',
      htmlBody: html,
    };

    const isSent = await this.emailService.sendEmail(emailOptions);

    if (!isSent) throw CustomError.internalServer('Error sending email');

    return true;
  };

  public async validateEmail(token: string) {
    try {
      const payload = (await JwtAdapter.validateToken(token)) as {
        email: string;
      };

      if (!payload) throw CustomError.badRequest('Invalid token');

      const { email } = payload;

      if (!email) throw CustomError.badRequest('Email not found');

      await UserModel.updateOne({ email }, { emailValidated: true });

      return true;
    } catch (error) {
      throw CustomError.internalServer(`Email not exists`);
    }
  }
}
