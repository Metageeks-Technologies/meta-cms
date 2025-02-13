import { PartialType } from "@nestjs/mapped-types";
import { CreateSubserviceDto } from "./create-subservice-dto";




export class UpdateSubserviceDto extends PartialType(CreateSubserviceDto) { }