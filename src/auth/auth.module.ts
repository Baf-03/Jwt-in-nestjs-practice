import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './Schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConst } from './jwtSecret.constants';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './JwtStrategy/LocalStrategy';

@Module({
  imports:[
  MongooseModule.forFeature([{name:User.name,schema:userSchema}]), 
  JwtModule.register({
    global: true,
    secret: jwtConst,
    signOptions: { expiresIn: '9000s' },
  }), PassportModule.register({ defaultStrategy: 'jwt' }), ],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy]
})
export class AuthModule {}