import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import {ObjectId} from 'mongodb'

@Injectable()
export class ValidateId implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): string{ // Optional casting into ObjectId if wanted!
      if(ObjectId.isValid(value)){
          return value;        
      }
      throw new BadRequestException("Invalid ID")
  };
}