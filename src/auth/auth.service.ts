import { Injectable, UnauthorizedException } from '@nestjs/common'
import { LoginDto } from './dto/auth.dto'
import { UserService } from 'src/user/user.service'
import { compare } from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

const EXPIRES_TIME = 5 * 3600 * 1000;

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ){ }

    /**
     * Validacion de loas credenciales del usuario, para generar un token
     * para el sistema.
     * @param dto 
     * @returns 
     */
    async login(dto: LoginDto){
        // Validar usuario
        const user = await this.validateUser(dto)
        // Elementos para poder crear el token al usuario en especifico
        const payload = {
            username: user.email,
            sub: {
                name: user.name
            }
        }
        // Creacion del token
        return {
            user,
            backendTokens: {
                accessToken: await this.jwtService.signAsync(payload,{
                    expiresIn: '1h',
                    secret: ""+process.env.jwtSecretKey
                }),
                refreshToken: await this.jwtService.signAsync(payload,{
                    expiresIn: '7d',
                    secret: ""+process.env.jwtRefreshTokenKey
                }),
                expiresIn: new Date().setTime(new Date().getTime() + EXPIRES_TIME)
            }
        }
    }

    /**
     * Metodo para verificar que el usuario exista, esto es para el tema de inicio de sesion
     * @param dto 
     * @returns 
     */
    async validateUser(dto: LoginDto){
        // Buscar la informacion del usuario
        const user = await this.userService.findByEmail(dto.username)
        // En caso de haber informacion
        if(user && (await compare(dto.password, user.password))) {
            // Despomponer la info, para omitir retornar la password
            const { password, ...result} = user
            return result
        }
        // Lanzar error en caso de no haber informacion
        throw new UnauthorizedException()
    }

    async refreshToken(user: any) {
        // Elementos para poder crear el token al usuario en especifico
        const payload = {
            username: user.username,
            sub: user.sub
        }
        return {
            accessToken: await this.jwtService.signAsync(payload,{
                expiresIn: '1h',
                secret: ""+process.env.jwtSecretKey
            }),
            refreshToken: await this.jwtService.signAsync(payload,{
                expiresIn: '7d',
                secret: ""+process.env.jwtRefreshTokenKey
            }),
            expiresIn: new Date().setTime(new Date().getTime() + EXPIRES_TIME)
        }
    }
}
