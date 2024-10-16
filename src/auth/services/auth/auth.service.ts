import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { registerDto } from 'src/auth/dtos/register.dto';
import { User } from 'src/auth/Schema/user.schema';
import * as bcrypt from "bcrypt";
import { loginDto } from 'src/auth/dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel:Model<User>,
        private jwtService:JwtService
    ){}

    async signup(userData:registerDto):Promise<User>{
        const {email,password,name}=userData;
        const userExist = await this.userModel.findOne({email})
        if(userExist){
            throw new HttpException("email already in use",400);
        }
        const encryptedPassword= await bcrypt.hash(password,10)
        const objToSave={
            email,
            password:encryptedPassword,
            name
        }
        const newUser = new this.userModel(objToSave);
        return await newUser.save()
    }

    async login(userData:loginDto){
        const {email,password}= userData;
        const userExist = await this.userModel.findOne({email});
        if(!userExist){
            throw new NotFoundException("email not found!")
        }
        const isPasswordValid = await bcrypt.compare(password,userExist.password);
        if(!isPasswordValid){
            throw new HttpException("password incorrect!",400);
        }
        const payload ={email:userExist.email,password:userExist.password}
        const token = this.jwtService.sign(payload)
        return {
            userInfo:userExist,
            token
        }
    }
    
    async validateUser(email: string): Promise<any> {
        try{
            const user = await this.userModel.findOne({email});
            if (user) {
              return user
            }
            return null;
        }catch(err){
            console.log(err)
        }
      } 
}
