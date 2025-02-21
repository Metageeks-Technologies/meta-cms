import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IPermission } from "./schema/permission.schema";
import { CreatePermissionDto } from "./dto/create-permission-dto";
import { UpdatePermissionDto } from "./dto/update-permission-dto";



@Injectable()
export class PermissionService {
    constructor(
        @InjectModel('Permission') private readonly Permission: Model<IPermission>
    ) { }


    async createPermission(permissionDetails: CreatePermissionDto) {
        const newPermission = new this.Permission(permissionDetails);

        try {
            await newPermission.save();
        } catch (error) {
            if (error.code === 11000) {
                // Duplicate key error
                throw new ConflictException('Permission already exists')
            }

            throw error;
        }
    }

    async updatePermission(id: string, permissionDetails: UpdatePermissionDto) {
        try {
            const query = await this.Permission.updateOne({ _id: id }, { $set: permissionDetails }).exec();

            if (query.matchedCount === 0) {
                throw new NotFoundException('Permission not found');
            }

        } catch (error) {
            if (error.code === 11000) {
                // Duplicate key error
                throw new ConflictException('Permission already exists')
            }

            throw error;
        }
    }

    async deletePermission(id: string) {
        const query = await this.Permission.updateOne({ _id: id }, { isDeleted: true }).exec();

        if (query.matchedCount === 0) {
            throw new NotFoundException('Permission not found');
        }
    }

    async recoverPermission(id: string) {
        const query = await this.Permission.updateOne({ _id: id }, { isDeleted: false }).exec();

        if(query.matchedCount === 0){
            throw new NotFoundException('Permission not found');
        }
    }

    async getPermission(){
        const permissions = await this.Permission.find().lean().exec();
        return permissions;
    }


}