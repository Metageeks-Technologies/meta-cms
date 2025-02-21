import { Type } from "class-transformer";
import {
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    ValidateNested,
    IsArray,
} from "class-validator";




class ImageSectionDto {
    @IsNotEmpty()
    @IsString()
    imageKey: string;
}

class HeadingImageDto {
    @IsNotEmpty()
    @IsString()
    heading: string;

    @IsNotEmpty()
    @IsString()
    imageKey: string;
}

class HeadingDescriptionDto {
    @IsNotEmpty()
    @IsString()
    heading: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}

class HeadingDescriptionImageDto {
    @IsNotEmpty()
    @IsString()
    imageKey: string;

    @IsNotEmpty()
    @IsString()
    heading: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}


class CardDto {
    @IsNotEmpty()
    @IsString()
    heading: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}


class HeadingCardsDto {
    @IsNotEmpty()
    @IsString()
    heading: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CardDto)
    cards: CardDto[];
}


class ProcessCardDto {
    @IsNotEmpty()
    @IsString()
    heading: string;

    @IsArray()
    @IsString({ each: true }) // Ensures list contains only strings
    @IsNotEmpty({ each: true }) // Prevents empty strings in list
    list: string[];
}


class ProcessSectionDto {
    @IsNotEmpty()
    @IsString()
    heading: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProcessCardDto)
    cards: ProcessCardDto[];
}


class ChallengeSectionDto {
    @IsNotEmpty()
    @IsString()
    heading: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CardDto)
    cards: CardDto[];
}


class CreateContentDto {
    @ValidateNested()
    @Type(() => ImageSectionDto)
    heroSection: ImageSectionDto;

    @ValidateNested()
    @Type(() => HeadingCardsDto)
    aboutSection: HeadingCardsDto;

    @ValidateNested()
    @Type(() => ImageSectionDto)
    uiSection: ImageSectionDto;

    @ValidateNested()
    @Type(() => HeadingDescriptionImageDto)
    serviceSection: HeadingDescriptionImageDto;

    @ValidateNested()
    @Type(() => ProcessSectionDto)
    processSection: ProcessSectionDto;

    @ValidateNested()
    @Type(() => HeadingImageDto)
    uiSection2: HeadingImageDto;

    @ValidateNested()
    @Type(() => ChallengeSectionDto)
    challengesSection: ChallengeSectionDto;

}


export class CreateCaseStudyDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @Matches(/^[a-z0-9-_/]+$/, { message: "Invalid Slug" })
    @MaxLength(128)
    slug: string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateContentDto)
    content: CreateContentDto;
}
