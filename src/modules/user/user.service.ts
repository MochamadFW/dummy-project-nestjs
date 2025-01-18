import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User, userDocument } from './schemas/user.schema';
import { ClientSession, Connection, Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    // Retrieve the model to the service layer using mongoose
    constructor(
        @InjectModel(User.name) private userModel: Model<userDocument>,
        // @InjectConnection() private readonly connection: Connection,
    ) {}

    // Create
    async create(createUserDto: CreateUserDto): Promise<User> {
        // const session: ClientSession = await this.connection.startSession();
        // session.startTransaction();
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

            const createUser = new this.userModel({...createUserDto, password: hashedPassword});
            const createdUser = await createUser.save();
            // await session.commitTransaction();

            return createdUser;
        } catch (error) {
            // await session.abortTransaction();
            throw new InternalServerErrorException('Failed to create user', error.message);
        } 
    }

    // Get All
    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    // Get by ID
    async findById(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec();
    }

    // Update by ID
    async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
        // const session: ClientSession = await this.connection.startSession();
        // session.startTransaction();
        try {
            if (updateUserDto.password) {
                const salt = await bcrypt.genSalt(10);
                updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
            }

            const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true}).exec();
            if (!updatedUser) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }
            // await session.commitTransaction();

            return updatedUser;
        } catch (error) {
            // await session.abortTransaction();
            if (error.name === 'CastError') {
                throw new BadRequestException(`Invalid ID format: ${id}`);
            }
            throw new InternalServerErrorException('Failed to update user', error.message);
        }
    }

    // Delete by ID
    async delete(id: string): Promise<User | null> {
        // const session: ClientSession = await this.connection.startSession();
        // session.startTransaction();
        try {
            const deletedUser = await this.userModel.findByIdAndDelete(id);
            if (!deletedUser) {
                throw new NotFoundException(`User with ID ${id} not found`)
            }
            // await session.commitTransaction();

            return deletedUser;
        } catch (error) {
            // await session.abortTransaction();
            if (error.name === 'CastError') {
                throw new BadRequestException(`Invalid ID format: ${id}`);
            }
            throw new InternalServerErrorException('Failed to delete user', error.message);
        }
    }
}
