import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { CreateUserDto } from 'src/user/dto/user.dto'
import { UserService } from 'src/user/user.service'
import { LoginDto } from './dto/auth.dto'
import { AuthService } from './auth.service'
import { RefreshJwtGuard } from './guards/refresh.guard'

@Controller('auth')
export class AuthController {
    constructor(
        private userService: UserService,
        private authService: AuthService
    ) {}

    /**
     * End Point para el registro/creacion de un nuevo usuario
     * @param dto 
     * @returns 
     */
    @Post('register')
    async registerUser(@Body() dto: CreateUserDto) {
        return await this.userService.create(dto)
    }

    /**
     * End Point para el inicio de sesion de un usuario
     * @param dto 
     * @returns 
     */
    @Post('login')
    async login(@Body() dto: LoginDto){
        return await this.authService.login(dto)
    }


    @UseGuards(RefreshJwtGuard)
    @Post('refresh')
    async refreshToken(@Request() req){
        console.log("Refrescado")
        return await this.authService.refreshToken(req.user)
    }
}
