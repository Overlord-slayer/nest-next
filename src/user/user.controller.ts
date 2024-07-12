import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    /**
     * End Point para obtener la informacion del usuario en base a su id
     * @param id 
     * @returns 
     */
    @UseGuards(JwtGuard)
    @Get(":id")
    async getUserProfile(@Param("id") id: number) {
        return await this.userService.findById(id)
    }
}
