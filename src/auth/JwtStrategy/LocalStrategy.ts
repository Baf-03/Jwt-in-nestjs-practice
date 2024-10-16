import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../services/auth/auth.service";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConst } from "../jwtSecret.constants";
import { Injectable, UnauthorizedException } from "@nestjs/common";



@Injectable() 
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private readonly authService:AuthService){
        super({
            jwtFromRequest :ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey:jwtConst
        })

        
    }

    async validate(payload:any){
        console.log("JWT Strategy Validate Function Triggered");

        const { email } = payload; 
    
        const user = await this.authService.validateUser(email);
        if (!user) {
          throw new UnauthorizedException('Invalid token');
        }
    
        return user; 
    }
}






