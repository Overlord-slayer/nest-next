import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateUserDto } from './dto/user.dto'
import { hash } from 'bcrypt'


@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}
    
    /**
     * Metodo para crear un nuevo usuario en la base de datos de prisma
     * @param dto 
     * @returns 
     */
    async create(dto: CreateUserDto){
        // Validar si existe
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })

        // No se permiten registros repetidos
        if (user) throw new ConflictException("Email duplicated")
        // Se crea, en caso de no existir
        const newUser = await this.prisma.user.create({
            data:{
                ...dto,
                password: await hash(dto.password, 10)
            }
        })
        // Se extrae la infor del nuevo usario, para solo omitir el retorno de la password
        const {password, ...result } = newUser
        return result
    }

    /**
     * Metodo para obtener el correo de la db, esto es mas para al inicio de sesion
     * @param email 
     * @returns 
     */
    async findByEmail(email: string){
        return await this.prisma.user.findUnique({
            where:{
                email: email
            }
        })
    }

    /**
     * Metodo para hallar el id especifico de la base de datos, esto par obtener el perfil
     * @param id 
     * @returns 
     */
    async findById(id: number){
        return await this.prisma.user.findUnique({
            where: {
                id: id
            }
        })
    }
}
