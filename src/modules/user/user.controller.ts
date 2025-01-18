import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/register')
    async registerNewUser(@Body() createUserDto: CreateUserDto) {
        try {
            const registerNewUser = await this.userService.create(createUserDto);
            return {
                status: true,
                message: 'Successfully registered new user',
                data: registerNewUser,
            }
        } catch (error) {
            this.handleException(error);
        }
    }

    @Get('/list')
    async fetchAllUser() {
        try {
            const users = await this.userService.findAll();
            return {
                status: true,
                message: 'Successfully fetched list of users',
                data: users,
            }
        } catch (error) {
            this.handleException(error)
        }
    }

    @Get('/detail/:id')
    async fetchDetailUser(@Param('id') id: string) {
        try {
            const detailUser = await this.userService.findById(id);
            return {
                status: true,
                message: 'Successfully fetched user detail',
                data: detailUser,
            }
        } catch (error) {
            this.handleException(error);
        }
    }

    @Patch('/edit/:id')
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        try {
            const updateUser = await this.userService.update(id, updateUserDto);
            return {
                status: true,
                message: 'Successfully updated user data',
                data: updateUser,
            }
        } catch (error) {
            this.handleException(error);
        }
    }

    @Delete('/delete/:id')
    async deleteUser(@Param('id') id: string) {
        try {
            const deleteUser = await this.userService.delete(id);
            return {
                status: true,
                message: 'Successfully deleted user',
                data: deleteUser,
            }
        } catch (error) {
            
        }
        return this.userService.delete(id);
    }

    // Centralized error-handling method
    private handleException(error: any): never {
    // If the error is an instance of HttpException, throw it as-is
        if (error instanceof HttpException) {
            throw error;
        }

        // Otherwise, throw a generic internal server error
        throw new HttpException(
            {
            status: false,
            message: error.message || 'Internal server error',
            data: null,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}
