import { PartialType } from "@nestjs/mapped-types";
import { CreateCaseStudyDto } from "./create-caseStudy-dto";


export class UpdateCaseStudyDto extends PartialType(CreateCaseStudyDto) { }