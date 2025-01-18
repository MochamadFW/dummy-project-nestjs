import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type userDocument = HydratedDocument<User>;

export enum UserRole {
    admin = 'admin',
    customer = 'customer'
}

@Schema()
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, select: false })
    password: string;

    @Prop({ type: String, enum: UserRole, default: UserRole.customer })
    role: UserRole;

    @Prop({ default: Date.now() })
    createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ name: 1, email: 1 });