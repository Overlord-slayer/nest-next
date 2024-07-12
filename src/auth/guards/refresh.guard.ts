import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class RefreshJwtGuard implements CanActivate {

    constructor(private jwtService: JwtService){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        // Obtener la solicitud HTTP del contexto
        const request = context.switchToHttp().getRequest();

        // Extraer el token del encabezado de autorización de la solicitud
        const token = this.extractTokenFromHeader(request);
        
        // Si no se encuentra el token, lanzar una excepción de no autorizado
        if (!token) throw new UnauthorizedException();

        try {
            // Verificar y decodificar el token usando el servicio JWT
            const payload = await this.jwtService.verifyAsync(token, {
                secret: "" + process.env.jwtRefreshTokenKey, // Utilizando la clave secreta definida en las variables de entorno
            });
            
            // Si la verificación es exitosa, asignar el payload (información del usuario) a la propiedad 'user' del objeto de solicitud
            request['user'] = payload;
        } catch {
            // Si hay algún error en la verificación del token, lanzar una excepción de no autorizado
            throw new UnauthorizedException();
        }
        
        // Si todo está bien, permitir el acceso
        return true;
    }

    /**
     * Extraer el token del encabezado de autorización y validar que tiene la estructura 'Bearer <token>'
     * @param request La solicitud HTTP
     * @returns El token JWT si está presente y tiene la estructura correcta, de lo contrario, devuelve undefined
     */
    private extractTokenFromHeader(request: Request) {
        // Dividir el encabezado de autorización en dos partes: tipo y token
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        // Verificar que el tipo de autenticación sea 'Bearer' y devolver el token si es así, de lo contrario, devolver undefined
        return type === 'Refresh' ? token : undefined;
    }
}
