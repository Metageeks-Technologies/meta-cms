import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IPremission } from "./schema/premission.schema";
import { CreatePremissionDto } from "./dto/create-premission-dto";
import { UpdatePremissionDto } from "./dto/update-premission-dto";



@Injectable()
export class PremissionService {
    constructor(
        @InjectModel('Premission') private readonly Premission: Model<IPremission>
    ) { }


    async createPremission(premissionDetails: CreatePremissionDto) {
        const newPremission = new this.Premission(premissionDetails);

        try {
            await newPremission.save();
        } catch (error) {
            if (error.code === 11000) {
                // Duplicate key error
                throw new ConflictException('Premission already exists')
            }

            throw error;
        }
    }

    async updatePremission(id: string, premissionDetails: UpdatePremissionDto) {
        try {
            const query = await this.Premission.updateOne({ _id: id }, { $set: premissionDetails }).exec();

            if (query.matchedCount === 0) {
                throw new NotFoundException('Premission not found');
            }

        } catch (error) {
            if (error.code === 11000) {
                // Duplicate key error
                throw new ConflictException('Premission already exists')
            }

            throw error;
        }
    }

    async deletePremission(id: string) {
        const query = await this.Premission.updateOne({ _id: id }, { isDeleted: true }).exec();

        if (query.matchedCount === 0) {
            throw new NotFoundException('Premission not found');
        }
    }

    async recoverPremission(id: string) {
        const query = await this.Premission.updateOne({ _id: id }, { isDeleted: false }).exec();

        if(query.matchedCount === 0){
            throw new NotFoundException('Premission not found');
        }
    }

    async getPremission(){
        const premissions = await this.Premission.find().lean().exec();
        return premissions;
    }


}