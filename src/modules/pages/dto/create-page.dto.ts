import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsObject, IsString, Matches, MaxLength, ValidateNested } from "class-validator";


class HeroSectionDto {
    @IsNotEmpty()
    @IsString()
    subHeading: string;

    @IsNotEmpty()
    @IsString()
    heading: string;

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsString()
    imageKey: string
}

class SolutionSection1Dto {
    @IsNotEmpty()
    @IsString()
    subHeading: string;

    @IsNotEmpty()
    @IsString()
    heading: string;

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsString()
    imageKey: string
}

class ServicesSectionCardDto {
    @IsNotEmpty()
    @IsString()
    imageKey: string

    @IsNotEmpty()
    @IsString()
    heading: string

    @IsNotEmpty()
    @IsString()
    description: string
}

class ServicesSectionDto {
    @IsNotEmpty()
    @IsString()
    heading: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ServicesSectionCardDto)
    cards: ServicesSectionCardDto[]
}


class ProcessSectionCardsDto {
    @IsNotEmpty()
    @IsString()
    heading: string

    @IsNotEmpty()
    @IsString()
    description: string
}
class ProcessSectionDto {
    @IsNotEmpty()
    @IsString()
    heading: string

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProcessSectionCardsDto)
    cards: ProcessSectionCardsDto[]
}

class SolutionSection2Dto {
    @IsNotEmpty()
    @IsString()
    subHeading: string;

    @IsNotEmpty()
    @IsString()
    heading: string;

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsString()
    imageKey: string;
}

class FeatureSectionCardsDto {
    @IsNotEmpty()
    @IsString()
    imageKey: string

    @IsNotEmpty()
    @IsString()
    heading: string

    @IsNotEmpty()
    @IsString()
    description: string
}

class FeatureSectionDto {
    @IsNotEmpty()
    @IsString()
    heading: string

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FeatureSectionCardsDto)
    features: FeatureSectionCardsDto[]
}

class MarketForecastSectionListDto {
    @IsNotEmpty()
    @IsString()
    point: string
}
class MarketForecastSectionDto {
    @IsNotEmpty()
    @IsString()
    imageKey: string

    @IsNotEmpty()
    @IsString()
    subHeading: string

    @IsNotEmpty()
    @IsString()
    heading: string

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MarketForecastSectionListDto)
    list: MarketForecastSectionListDto
}
class WhyChooseSectionCardDto {
    @IsNotEmpty()
    @IsString()
    heading: string

    @IsNotEmpty()
    @IsString()
    description: string
}

class WhyChooseSectionDto {
    @IsNotEmpty()
    @IsString()
    heading: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WhyChooseSectionCardDto)
    cards: WhyChooseSectionCardDto
}

class ReviewsSectionCardDto {
    @IsNotEmpty()
    @IsString()
    message: string

    @IsNotEmpty()
    @IsString()
    imageKey: string

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    company: string
}

class ReviewsSectionDto {
    @IsNotEmpty()
    @IsString()
    heading: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => ReviewsSectionCardDto)
    cards: ReviewsSectionCardDto[]
}

export class CreateContentDto {

    @ValidateNested()
    @Type(() => HeroSectionDto)
    heroSection: HeroSectionDto

    @ValidateNested()
    @Type(() => SolutionSection1Dto)
    solutionSection1: SolutionSection1Dto

    @ValidateNested()
    @Type(() => ServicesSectionDto)
    servicesSection: ServicesSectionDto

    @ValidateNested()
    @Type(() => ProcessSectionDto)
    processSection: ProcessSectionDto


    @ValidateNested()
    @Type(() => SolutionSection2Dto)
    solutionSection2: SolutionSection2Dto


    @ValidateNested()
    @Type(() => FeatureSectionDto)
    featureSection: FeatureSectionDto


    @ValidateNested()
    @Type(() => MarketForecastSectionDto)
    marketForecastSection: MarketForecastSectionDto

    @ValidateNested()
    @Type(() => WhyChooseSectionDto)
    whyChooseSection: WhyChooseSectionDto

    @ValidateNested()
    @Type(() => ReviewsSectionDto)
    reviewsSection: ReviewsSectionDto
}

export class CreatePageDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @Matches(/^[a-z0-9-_/]+$/, { message: 'Invalid Slug' })
    @MaxLength(128)
    slug: string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateContentDto)
    content: CreateContentDto;
}

