import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { loginDto } from 'src/auth/dtos/login.dto';
import { registerDto } from 'src/auth/dtos/register.dto';
import { AuthService } from 'src/auth/services/auth/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @Post("/register")
    @UsePipes(new ValidationPipe())
    register(
        @Body() userData:registerDto
    ){
       return this.authService.signup(userData)
    }

    @Post("/login")
    @UsePipes(new ValidationPipe())
    login(
        @Body() userData:loginDto
    ){
        return this.authService.login(userData)
    }

    @UseGuards(JwtAuthGuard)
    @Get("/verify")
    verify(){
        return "verified"
    }
}
