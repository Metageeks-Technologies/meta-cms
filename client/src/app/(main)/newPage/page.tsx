'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axiosCall from '@/utils/ApiCall';
import { useUserContext } from '@/context/userContext';
import { getURL } from '@/utils/AWS_Config';
import axios from 'axios';
import { list } from 'postcss';
import { PageService, PageSubService } from '@/constant/page';
import { Card, Feature, PageContent } from '@/types';



const INITIAL_PAGE_CONTENT: PageContent = {
    title: '',
    slug: '',
    service: '',
    subService: '',
    content: {
        heroSection: {
            subHeading: '',
            heading: '',
            description: '',
            imageKey: ''
        },
        solutionSection1: {
            subHeading: '',
            heading: '',
            description: '',
            imageKey: ''
        },
        servicesSection: {
            heading: '',
            description: '',
            cards: [
                {
                    imageKey: '',
                    heading: '',
                    description: ''
                }
            ]
        },
        processSection: {
            heading: '',
            cards: [{
                heading: '',
                description: ''
            }]
        },
        solutionSection2: {
            subHeading: '',
            heading: '',
            description: '',
            imageKey: ''
        },
        featureSection: {
            heading: '',
            features: [
                {
                    imageKey: '',
                    heading: '',
                    description: ''
                }
            ]
        },
        marketForecastSection: {
            subHeading: '',
            heading: '',
            imageKey: '',
            list: [{
                point: '',
            }]
        },

    }
};

const CreatePage = () => {
    const { setLoading } = useUserContext();
    const [formData, setFormData] = useState<PageContent>(INITIAL_PAGE_CONTENT);
    // console.log(formData)
    const [subServiceArr, setSubServiceArr] = useState<any>([])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSectionChange = (
        section: 'heroSection' | 'solutionSection1' | 'servicesSection' | 'processSection' | 'solutionSection2' | 'featureSection' | 'marketForecastSection',
        field: string,
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            content: {
                ...prev.content,
                [section]: {
                    ...prev.content[section],
                    [field]: value
                }
            }
        }));
    };

    const handleCardChange = (
        index: number,
        section: 'servicesSection' | 'processSection' | 'featureSection' | 'marketForecastSection' | 'whyChooseSection' | 'reviewsSection',
        field: 'heading' | 'description' | 'point' | 'name' | 'company' | 'message',
        value: string
    ) => {
        let updatedCards: any;
        let updatedFeatures: any;
        let updatedList: any;
        if (section === 'servicesSection') {
            updatedCards = [...formData.content.servicesSection.cards];
            updatedCards[index] = {
                ...updatedCards[index],
                [field]: value
            };
            setFormData((prev) => ({
                ...prev,
                content: {
                    ...prev.content,
                    servicesSection: {
                        ...prev.content.servicesSection,
                        cards: updatedCards
                    }
                }
            }));
        } else if (section === 'processSection') {
            updatedCards = [...formData.content.processSection.cards];
            updatedCards[index] = {
                ...updatedCards[index],
                [field]: value
            };
            setFormData((prev) => ({
                ...prev,
                content: {
                    ...prev.content,
                    processSection: {
                        ...prev.content.processSection,
                        cards: updatedCards
                    }
                }
            }));
        } else if (section === 'featureSection') {
            updatedFeatures = [...formData.content.featureSection.features];
            updatedFeatures[index] = {
                ...updatedFeatures[index],
                [field]: value
            };
            setFormData((prev) => ({
                ...prev,
                content: {
                    ...prev.content,
                    featureSection: {
                        ...prev.content.featureSection,
                        features: updatedFeatures
                    }
                }
            }));
        } else if (section === 'marketForecastSection') {
            updatedList = [...formData.content.marketForecastSection.list];
            updatedList[index] = {
                ...updatedList[index],
                [field]: value
            };
            setFormData((prev) => ({
                ...prev,
                content: {
                    ...prev.content,
                    marketForecastSection: {
                        ...prev.content.marketForecastSection,
                        list: updatedList
                    }
                }
            }));
        }
    };


    // General handleImageChange function for all sections
    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
        section: 'heroSection' | 'solutionSection1' | 'servicesSection' | 'solutionSection2' | 'featureSection' | 'marketForecastSection',
        index?: number
    ) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const payload = {
                folderName: process.env.NEXT_PUBLIC_AWS_FOLDER_PAGES,
                fileName: file.name,
                contentType: file.type
            };

            try {
                const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/media/signed-upload-url`, payload);
                if (resp.status === 200 || resp.status === 201) {
                    const response = await axios.put(resp?.data?.uploadUrl, file);
                    if (response.status === 200 || response.status === 201) {
                        const imageKey = resp?.data?.key;

                        // Update imageKey based on section and index
                        if (section === 'heroSection') {
                            setFormData((prev) => ({
                                ...prev,
                                content: {
                                    ...prev.content,
                                    heroSection: {
                                        ...prev.content.heroSection,
                                        imageKey
                                    }
                                }
                            }));
                        } else if (section === 'solutionSection1') {
                            setFormData((prev) => ({
                                ...prev,
                                content: {
                                    ...prev.content,
                                    solutionSection1: {
                                        ...prev.content.solutionSection1,
                                        imageKey
                                    }
                                }
                            }));
                        } else if (section === 'servicesSection' && index !== undefined) {
                            const updatedCards = [...formData.content.servicesSection.cards];
                            updatedCards[index] = {
                                ...updatedCards[index],
                                imageKey
                            };
                            setFormData((prev) => ({
                                ...prev,
                                content: {
                                    ...prev.content,
                                    servicesSection: {
                                        ...prev.content.servicesSection,
                                        cards: updatedCards
                                    }
                                }
                            }));
                        } else if (section === 'solutionSection2') {
                            setFormData((prev) => ({
                                ...prev,
                                content: {
                                    ...prev.content,
                                    solutionSection2: {
                                        ...prev.content.solutionSection2,
                                        imageKey
                                    }
                                }
                            }));
                        } else if (section === 'featureSection' && index !== undefined) {
                            const updatedFeatures = [...formData.content.featureSection.features];
                            updatedFeatures[index] = {
                                ...updatedFeatures[index],
                                imageKey
                            };
                            setFormData((prev) => ({
                                ...prev,
                                content: {
                                    ...prev.content,
                                    featureSection: {
                                        ...prev.content.featureSection,
                                        features: updatedFeatures
                                    }
                                }
                            }));
                        } else if (section === 'marketForecastSection') {
                            setFormData((prev) => ({
                                ...prev,
                                content: {
                                    ...prev.content,
                                    marketForecastSection: {
                                        ...prev.content.marketForecastSection,
                                        imageKey
                                    }
                                }
                            }));
                        }
                    }
                } else {
                    toast.error(resp?.data?.message, { duration: 2000 });
                }
            } catch (error) {
                console.log(error);
                toast.error('Failed to upload the image', { duration: 2000 });
            }
        }
    };

    const removeCard = (
        index: number,
        section: 'servicesSection' | 'processSection' | 'featureSection' | 'marketForecastSection'
    ) => {
        let updatedCards: any;

        if (section === 'servicesSection') {
            updatedCards = formData.content.servicesSection.cards.filter(
                (_, i) => i !== index
            );
            setFormData((prev) => ({
                ...prev,
                content: {
                    ...prev.content,
                    servicesSection: {
                        ...prev.content.servicesSection,
                        cards: updatedCards,
                    },
                },
            }));
        } else if (section === 'processSection') {
            updatedCards = formData.content.processSection.cards.filter(
                (_, i) => i !== index
            );
            setFormData((prev) => ({
                ...prev,
                content: {
                    ...prev.content,
                    processSection: {
                        ...prev.content.processSection,
                        cards: updatedCards,
                    },
                },
            }));
        } else if (section === 'featureSection') {
            updatedCards = formData.content.featureSection.features.filter(
                (_, i) => i !== index
            );
            setFormData((prev) => ({
                ...prev,
                content: {
                    ...prev.content,
                    featureSection: {
                        ...prev.content.featureSection,
                        features: updatedCards,
                    },
                },
            }));
        } else if (section === 'marketForecastSection') {
            updatedCards = formData.content.marketForecastSection.list.filter(
                (_, i) => i !== index
            );
            setFormData((prev) => ({
                ...prev,
                content: {
                    ...prev.content,
                    marketForecastSection: {
                        ...prev.content.marketForecastSection,
                        list: updatedCards,
                    },
                },
            }));
        }
    };


    const addCard = () => {
        const newCard: Card = {
            imageKey: '',
            heading: '',
            description: ''
        };
        setFormData((prev) => ({
            ...prev,
            content: {
                ...prev.content,
                servicesSection: {
                    ...prev.content.servicesSection,
                    cards: [...prev.content.servicesSection.cards, newCard]
                }
            }
        }));
    };

    const addProcessCard = () => {
        const newCard = {
            heading: '',
            description: ''
        };
        setFormData((prev) => ({
            ...prev,
            content: {
                ...prev.content,
                processSection: {
                    ...prev.content.processSection,
                    cards: [...prev.content.processSection.cards, newCard]
                }
            }
        }));
    };

    const addFeature = () => {
        const newFeature: Feature = {
            imageKey: '',
            heading: '',
            description: ''
        };
        setFormData((prev) => ({
            ...prev,
            content: {
                ...prev.content,
                featureSection: {
                    ...prev.content.featureSection,
                    features: [...prev.content.featureSection.features, newFeature]
                }
            }
        }));
    };

    const addList = () => {
        const newList = {
            point: ''
        };
        setFormData((prev) => ({
            ...prev,
            content: {
                ...prev.content,
                marketForecastSection: {
                    ...prev.content.marketForecastSection,
                    list: [...prev.content.marketForecastSection.list, newList]
                }
            }
        }));
    };

    const handleSelectService = (e: any) => {
        const { value } = e.target;

        setFormData((prev) => ({
            ...prev,
            service: value,
            subService: ""
        }));

        if(!value){
            setSubServiceArr([]);
            return
        }

        setSubServiceArr(PageSubService[value as keyof typeof PageSubService]);
    }





    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) {
            toast.error("Title is required", { duration: 2000 });
            return;
        }

        if (!formData.slug) {
            toast.error("Slug is required", { duration: 2000 });
            return;
        }

        if (formData.slug.trim().length < 3) {
            toast.error('Slug should be at least 3 characters long.', { duration: 2000 });
            return;
        }

        if (!formData.content || Object.keys(formData.content).length === 0) {
            toast.error("Content is required", { duration: 2000 });
            return;
        }

        if (!formData.content.heroSection?.imageKey) {
            toast.error("Hero section image is required", { duration: 2000 });
            return;
        }
        if (!formData.content.solutionSection1?.imageKey) {
            toast.error(" solution section 1 image is required", { duration: 2000 });
            return;
        }
        if (!formData.content.solutionSection2?.imageKey) {
            toast.error(" solution section 2 image is required", { duration: 2000 });
            return;
        }
        if (!formData.content.marketForecastSection?.imageKey) {
            toast.error(" market section image is required", { duration: 2000 });
            return;
        }


        const missingImageIndex = formData.content.servicesSection?.cards.findIndex(
            (card: any) => !card.imageKey
        );

        if (missingImageIndex !== -1) {
            toast.error(` service section Card  image is required`, { duration: 2000 });
            return;
        }

        const missing2ImageIndex = formData.content.featureSection?.features.findIndex(
            (feature: any) => !feature.imageKey
        );

        if (missing2ImageIndex !== -1) {
            toast.error(`Feature section image image is required`, { duration: 2000 });
            return;
        }




        setLoading(true);
        try {
            const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/pages`, formData);
            if (resp?.status === 200 || resp?.status === 201) {
                toast.success(resp.data.message, { duration: 2000 });
                setFormData(INITIAL_PAGE_CONTENT);
            } else {
                toast.error(resp?.data?.message, { duration: 2000 });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen mt-10 text-white px-6 sm:px-8 md:px-12 lg:px-16">
            <form onSubmit={handleSubmit}>
                {/* Title and Slug inputs */}
                <label className="w-full flex flex-col gap-2 mb-5">
                    <span>Title</span>
                    <input
                        type="text"
                        className="w-full bg-[#1A1A1A] px-4 py-2 rounded-lg outline-none border-none"
                        id="title"
                        placeholder="Enter title"
                        value={formData.title}
                        maxLength={120}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label className="w-full flex flex-col gap-2 mb-5">
                    <span>Enter Slug</span>
                    <span className="text-xs italic text-gray-400 -mt-3">(Contain only lowercase letters, numbers, hyphens, and underscores)</span>
                    <input
                        type="text"
                        id="slug"
                        className="w-full bg-[#1A1A1A] px-4 py-2 rounded-lg outline-none border-none"
                        placeholder="Enter slug"
                        value={formData.slug}
                        onChange={handleChange}
                        required
                    />
                </label>

                <div className='flex flex-row gap-5 items-center'>
                    <label className="w-full flex flex-col gap-2 mb-5">
                        <span>Service</span>
                        <select onChange={handleSelectService} name="" id="" value={formData.service} className="w-full py-3 bg-[#1A1A1A] px-4 rounded-lg outline-none border-none" required>
                            <option value="">--Select service--</option>
                            {
                                PageService.map((service, index) => (
                                    <option key={index} value={service.key}>{service.title}</option>
                                ))
                            }
                        </select>
                    </label>

                    <label className="w-full flex flex-col gap-2 mb-5">
                        <span>Sub Service</span>
                        <select
                            name=""
                            id="subService"
                            value={formData.subService}
                            onChange={(e) => setFormData((prev) => ({ ...prev, subService: e.target.value }))}
                            className="w-full py-3 bg-[#1A1A1A] px-4 rounded-lg outline-none border-none"
                            disabled= {formData.service === ""? true : false}
                            required
                        >
                            <option value="">--Select sub service--</option>
                            {
                                subServiceArr.map((service: any, index: any) => (
                                    <option key={index} value={service.key}>{service.title}</option>
                                ))
                            }
                        </select>
                    </label>
                </div>

                <label className="block text-white mb-5">
                    <span>Hero Section</span>
                    <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md mt-2">
                        {/* Hero Section Fields */}
                        <div className="mb-4">
                            <label htmlFor="subHeading" className="block text-gray-300 mb-2">
                                Sub Heading
                            </label>
                            <input
                                type="text"
                                id="subHeading"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Sub Heading"
                                value={formData.content.heroSection.subHeading}
                                onChange={(e) => handleSectionChange('heroSection', 'subHeading', e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="heading" className="block  text-gray-300 mb-2">
                                Heading
                            </label>
                            <input
                                type="text"
                                id="heading"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Heading"
                                value={formData.content.heroSection.heading}
                                onChange={(e) => handleSectionChange('heroSection', 'heading', e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="description" className="block  text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Description"
                                value={formData.content.heroSection.description}
                                onChange={(e) => handleSectionChange('heroSection', 'description', e.target.value)}
                                rows={4}
                                required
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="mb-6">
                            <label className="block text-gray-300 mb-2">Upload Image</label>
                            <label
                                className="relative w-full h-48 bg-[#222222] border-2 border-gray-600 rounded-lg flex justify-center items-center cursor-pointer"
                                htmlFor="imageInputHero"
                            >
                                {formData.content.heroSection.imageKey ? (
                                    <img
                                        src={getURL(formData.content.heroSection.imageKey)}
                                        alt="Preview"
                                        className="object-contain w-full h-full rounded-lg"
                                    />
                                ) : (
                                    <span className="text-white text-3xl">+</span>
                                )}
                            </label>
                            <input
                                type="file"
                                id="imageInputHero"
                                className="hidden"
                                onChange={(e) => handleImageChange(e, 'heroSection')}

                            />
                        </div>
                    </div>
                </label>

                {/* Solution Section 1*/}
                <label className="block text-white mb-5">
                    <span>Solution Section 1</span>
                    <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md mt-2">
                        <div className="mb-4">
                            <label htmlFor="subHeading" className="block text-gray-300 mb-2">
                                Sub Heading
                            </label>
                            <input
                                type="text"
                                id="subHeading"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Sub Heading"
                                value={formData.content.solutionSection1.subHeading}
                                onChange={(e) => handleSectionChange('solutionSection1', 'subHeading', e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="heading" className="block  text-gray-300 mb-2">
                                Heading
                            </label>
                            <input
                                type="text"
                                id="heading"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Heading"
                                value={formData.content.solutionSection1.heading}
                                onChange={(e) => handleSectionChange('solutionSection1', 'heading', e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="description" className="block  text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Description"
                                value={formData.content.solutionSection1.description}
                                onChange={(e) => handleSectionChange('solutionSection1', 'description', e.target.value)}
                                rows={4}
                                required
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="mb-6">
                            <label className="block text-gray-300 mb-2">Upload Image</label>
                            <label
                                className="relative w-full h-48 bg-[#222222] border-2 border-gray-600 rounded-lg flex justify-center items-center cursor-pointer"
                                htmlFor="imageInputSolution"
                            >
                                {formData.content.solutionSection1.imageKey ? (
                                    <img
                                        src={getURL(formData.content.solutionSection1.imageKey)}
                                        alt="Preview"
                                        className="object-contain w-full h-full rounded-lg"
                                    />
                                ) : (
                                    <span className="text-white text-3xl">+</span>
                                )}
                            </label>
                            <input
                                type="file"
                                id="imageInputSolution"
                                className="hidden"
                                onChange={(e) => handleImageChange(e, 'solutionSection1')}

                            />
                        </div>
                    </div>
                </label>

                {/* Service Section */}
                <label className="block text-white mb-5">
                    <span>Service Section</span>
                    <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md mt-2">
                        <div className="mb-4">
                            <label htmlFor="heading" className="block text-gray-300 mb-2">
                                Heading
                            </label>
                            <input
                                type="text"
                                id="heading"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Heading"
                                value={formData.content.servicesSection.heading}
                                onChange={(e) => handleSectionChange('servicesSection', 'heading', e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="block  text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Description"
                                value={formData.content.servicesSection.description}
                                onChange={(e) => handleSectionChange('servicesSection', 'description', e.target.value)}
                                rows={4}
                                required
                            />
                        </div>


                        {/* Cards Section */}
                        {formData.content.servicesSection.cards.map((card, index) => (
                            <div key={index} className="bg-[#222222] p-4 rounded-lg mb-4 relative">
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 text-red-500"
                                    onClick={() => removeCard(index, 'servicesSection')}
                                >
                                    <span className="text-xl">×</span> {/* "×" is the close icon */}
                                </button>
                                <div className="mb-4">
                                    <label htmlFor={`service-card-heading-${index}`} className="block text-gray-300 mb-2">
                                        Heading
                                    </label>
                                    <input
                                        type="text"
                                        id={`card-heading-${index}`}
                                        className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#333333] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter Heading"
                                        value={card.heading}
                                        onChange={(e) => handleCardChange(index, 'servicesSection', 'heading', e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor={`service-card-description-${index}`} className="block text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        id={`card-description-${index}`}
                                        className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#333333] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter Description"
                                        value={card.description}
                                        onChange={(e) => handleCardChange(index, 'servicesSection', 'description', e.target.value)}
                                        rows={3}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-300 mb-2">Upload Image</label>
                                    <label
                                        className="relative w-full h-48 bg-[#333333] border-2 border-gray-600 rounded-lg flex justify-center items-center cursor-pointer"
                                        htmlFor={`imageInputCard-${index}`}
                                    >
                                        {card.imageKey ? (
                                            <img
                                                src={getURL(card.imageKey)}
                                                alt="Card Preview"
                                                className="object-contain w-full h-full rounded-lg"
                                            />
                                        ) : (
                                            <span className="text-white text-3xl">+</span>
                                        )}
                                    </label>
                                    <input
                                        type="file"
                                        id={`imageInputCard-${index}`}
                                        className="hidden"
                                        onChange={(e) => handleImageChange(e, 'servicesSection', index)}

                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            onClick={addCard}
                        >
                            Add More
                        </button>
                    </div>
                </label>

                {/* Process Section */}
                <label className="block text-white mb-5">
                    <span>Process Section</span>
                    <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md mt-2">
                        <div className="mb-4">
                            <label htmlFor="processSectionHeading" className="block text-gray-300 mb-2">
                                Heading
                            </label>
                            <input
                                type="text"
                                id="processSectionHeading"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Heading"
                                value={formData.content.processSection.heading}
                                onChange={(e) => handleSectionChange('processSection', 'heading', e.target.value)}
                                required
                            />
                        </div>

                        {/* Cards Section */}
                        {formData.content.processSection.cards.map((card, index) => (
                            <div key={index} className="bg-[#222222] p-4 rounded-lg mb-4 relative">
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 text-red-500"
                                    onClick={() => removeCard(index, 'processSection')}
                                >
                                    <span className="text-xl">×</span> {/* "×" is the close icon */}
                                </button>
                                <div className="mb-4">
                                    <label htmlFor={`process-card-heading-${index}`} className="block text-gray-300 mb-2">
                                        Heading
                                    </label>
                                    <input
                                        type="text"
                                        id={`process-card-heading-${index}`}
                                        className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#333333] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter Heading"
                                        value={card.heading}
                                        onChange={(e) => handleCardChange(index, 'processSection', 'heading', e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor={`process-card-description-${index}`} className="block text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        id={`process-card-description-${index}`}
                                        className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#333333] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter Description"
                                        value={card.description}
                                        onChange={(e) => handleCardChange(index, 'processSection', 'description', e.target.value)}
                                        rows={3}
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            onClick={addProcessCard}
                        >
                            Add More
                        </button>
                    </div>
                </label>

                {/* Solution Section 2*/}
                <label className="block text-white mb-5">
                    <span>Solution Section 2</span>
                    <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md mt-2">
                        <div className="mb-4">
                            <label htmlFor="subHeading" className="block text-gray-300 mb-2">
                                Sub Heading
                            </label>
                            <input
                                type="text"
                                id="subHeading"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Sub Heading"
                                value={formData.content.solutionSection2.subHeading}
                                onChange={(e) => handleSectionChange('solutionSection2', 'subHeading', e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="heading" className="block  text-gray-300 mb-2">
                                Heading
                            </label>
                            <input
                                type="text"
                                id="heading"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Heading"
                                value={formData.content.solutionSection2.heading}
                                onChange={(e) => handleSectionChange('solutionSection2', 'heading', e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="description" className="block  text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Description"
                                value={formData.content.solutionSection2.description}
                                onChange={(e) => handleSectionChange('solutionSection2', 'description', e.target.value)}
                                rows={4}
                                required
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="mb-6">
                            <label className="block text-gray-300 mb-2">Upload Image</label>
                            <label
                                className="relative w-full h-48 bg-[#222222] border-2 border-gray-600 rounded-lg flex justify-center items-center cursor-pointer"
                                htmlFor="imageInputSolution2"
                            >
                                {formData.content.solutionSection2.imageKey ? (
                                    <img
                                        src={getURL(formData.content.solutionSection2.imageKey)}
                                        alt="Preview"
                                        className="object-contain w-full h-full rounded-lg"
                                    />
                                ) : (
                                    <span className="text-white text-3xl">+</span>
                                )}
                            </label>
                            <input
                                type="file"
                                id="imageInputSolution2"
                                className="hidden"
                                onChange={(e) => handleImageChange(e, 'solutionSection2')}

                            />
                        </div>
                    </div>
                </label>

                {/* Feature Section */}
                <label className="block text-white mb-5">
                    <span>Feature Section</span>
                    <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md mt-2">
                        <div className="mb-4">
                            <label htmlFor="heading" className="block text-gray-300 mb-2">
                                Heading
                            </label>
                            <input
                                type="text"
                                id="heading"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Heading"
                                value={formData.content.featureSection.heading}
                                onChange={(e) => handleSectionChange('featureSection', 'heading', e.target.value)}
                                required
                            />
                        </div>



                        {/* Cards Section */}
                        {formData.content.featureSection.features.map((feature, index) => (
                            <div key={index} className="bg-[#222222] p-4 rounded-lg mb-4 relative">
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 text-red-500"
                                    onClick={() => removeCard(index, 'featureSection')}
                                >
                                    <span className="text-xl">×</span> {/* "×" is the close icon */}
                                </button>
                                <div className="mb-4">
                                    <label htmlFor={`features-feature-heading-${index}`} className="block text-gray-300 mb-2">
                                        Heading
                                    </label>
                                    <input
                                        type="text"
                                        id={`feature-heading-${index}`}
                                        className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#333333] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter Card Heading"
                                        value={feature.heading}
                                        onChange={(e) => handleCardChange(index, 'featureSection', 'heading', e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor={`service-card-description-${index}`} className="block text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        id={`feature-description-${index}`}
                                        className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#333333] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter Card Description"
                                        value={feature.description}
                                        onChange={(e) => handleCardChange(index, 'featureSection', 'description', e.target.value)}
                                        rows={3}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-300 mb-2">Upload Image</label>
                                    <label
                                        className="relative w-full h-48 bg-[#333333] border-2 border-gray-600 rounded-lg flex justify-center items-center cursor-pointer"
                                        htmlFor={`imageInputFeature-${index}`}
                                    >
                                        {feature.imageKey ? (
                                            <img
                                                src={getURL(feature.imageKey)}
                                                alt="Feature Preview"
                                                className="object-contain w-full h-full rounded-lg"
                                            />
                                        ) : (
                                            <span className="text-white text-3xl">+</span>
                                        )}
                                    </label>
                                    <input
                                        type="file"
                                        id={`imageInputFeature-${index}`}
                                        className="hidden"
                                        onChange={(e) => handleImageChange(e, 'featureSection', index)}

                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            onClick={addFeature}
                        >
                            Add More
                        </button>
                    </div>
                </label>

                {/* market forecast Section  */}
                <label className="block text-white mb-5">
                    <span>Market Forecast Section</span>
                    <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md mt-2">

                        <div className="mb-4">
                            <label htmlFor="subHeading" className="block text-gray-300 mb-2">
                                Sub Heading
                            </label>
                            <input
                                type="text"
                                id="subHeading"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Sub Heading"
                                value={formData.content.marketForecastSection.subHeading}
                                onChange={(e) => handleSectionChange('marketForecastSection', 'subHeading', e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="heading" className="block  text-gray-300 mb-2">
                                Heading
                            </label>
                            <input
                                type="text"
                                id="heading"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Heading"
                                value={formData.content.marketForecastSection.heading}
                                onChange={(e) => handleSectionChange('marketForecastSection', 'heading', e.target.value)}
                                required
                            />
                        </div>



                        {/* Image Upload */}
                        <div className="mb-6">
                            <label className="block text-gray-300 mb-2">Upload Image</label>
                            <label
                                className="relative w-full h-48 bg-[#222222] border-2 border-gray-600 rounded-lg flex justify-center items-center cursor-pointer"
                                htmlFor="imageInputMarket"
                            >
                                {formData.content.marketForecastSection.imageKey ? (
                                    <img
                                        src={getURL(formData.content.marketForecastSection.imageKey)}
                                        alt="Preview"
                                        className="object-contain w-full h-full rounded-lg"
                                    />
                                ) : (
                                    <span className="text-white text-3xl">+</span>
                                )}
                            </label>
                            <input
                                type="file"
                                id="imageInputMarket"
                                className="hidden"
                                onChange={(e) => handleImageChange(e, 'marketForecastSection')}

                            />
                        </div>

                        {/* Cards Section */}
                        {formData.content.marketForecastSection.list.map((card, index) => (
                            <div key={index} className="bg-[#222222] p-4 rounded-lg mb-4 relative">
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 text-red-500"
                                    onClick={() => removeCard(index, 'marketForecastSection')}
                                >
                                    <span className="text-xl">×</span> {/* "×" is the close icon */}
                                </button>

                                <div className="mb-4">
                                    <label htmlFor={`market-card-description-${index}`} className="block text-gray-300 mb-2">
                                        point
                                    </label>
                                    <textarea
                                        id={`market-card-description-${index}`}
                                        className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#333333] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter the point"
                                        value={card.point}
                                        onChange={(e) => handleCardChange(index, 'marketForecastSection', 'point', e.target.value)}
                                        rows={3}
                                        required
                                    />
                                </div>


                            </div>
                        ))}
                        <button
                            type="button"
                            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            onClick={addList}
                        >
                            Add More
                        </button>
                    </div>
                </label>





                <button
                    type="submit"
                    className="px-6 py-3 mb-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                    Create Page
                </button>
            </form>
        </div>
    );
};

export default CreatePage;
