'use client'
import { INITIAL_CASESTUDY_CONTENT } from '@/constant/caseStudy';
import { caseStudyContent } from '@/types';
import { getURL } from '@/utils/AWS_Config';
import React, { useEffect, useState } from 'react'
import { aboutCard } from '@/types';
import axiosCall from '@/utils/ApiCall';
import axios from 'axios';
import toast from 'react-hot-toast';


const CreateCaseStudy = () => {

    const [formData, setFormData] = useState<caseStudyContent>(INITIAL_CASESTUDY_CONTENT);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === 'slug') {
            const cleanedValue = value
                .toLowerCase()              
                .replace(/[^a-z0-9-]/g, ''); 

            setFormData((prev) => ({
                ...prev,
                [id]: cleanedValue,  
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [id]: value,
            }));
        }

    };

    const addCard = () => {
        const newCard: aboutCard = {
            heading: '',
            description: ''
        };
        setFormData((prev) => ({
            ...prev,
            content: {
                ...prev.content,
                aboutSection: {
                    ...prev.content.aboutSection,
                    aboutCards: [...prev.content.aboutSection.aboutCards, newCard]
                }
            }
        }));
    };

    const addCardChallange = () => {
        const newCard: aboutCard = {
            heading: '',
            description: ''
        };
        setFormData((prev) => ({
            ...prev,
            content: {
                ...prev.content,
                challengesSection: {
                    ...prev.content.challengesSection,
                    StudyChallangeList: [...prev.content.challengesSection.StudyChallangeList, newCard]
                }
            }
        }));
    };


    const removeCard = (
        index: number,
        section: 'aboutSection' | 'processSection' | 'challengesSection'
    ) => {
        let updatedCards: any;

        if (section === 'aboutSection') {
            updatedCards = formData.content.aboutSection.aboutCards.filter(
                (_, i) => i !== index
            );
            setFormData((prev) => ({
                ...prev,
                content: {
                    ...prev.content,
                    aboutSection: {
                        ...prev.content.aboutSection,
                        aboutCards: updatedCards,  // Correctly update aboutCards
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
        } else if (section === 'challengesSection') {
            updatedCards = formData.content.challengesSection.StudyChallangeList.filter(
                (_, i) => i !== index
            );
            setFormData((prev) => ({
                ...prev,
                content: {
                    ...prev.content,
                    challengesSection: {
                        ...prev.content.challengesSection,
                        StudyChallangeList: updatedCards,  // Correctly update StudyChallangeList
                    },
                },
            }));
        }
    };

    const addListItem = (cardIndex: number, section: 'processSection') => {
        if (section === 'processSection') {
            // Create a new empty list item with an empty string or a default value
            const newListItem = { list: '' };
    
            // Update the cardList by adding the new list item to the correct card
            setFormData((prev) => ({
                ...prev,
                content: {
                    ...prev.content,
                    processSection: {
                        ...prev.content.processSection,
                        cards: prev.content.processSection.cards.map((card, index) =>
                            index === cardIndex
                                ? { 
                                    ...card, 
                                    cardList: [...card.cardList, newListItem] // Add the new list item only to the selected card
                                }
                                : card // Keep the rest of the cards unchanged
                        ),
                    },
                },
            }));
        }
    };
    

    const processaddCard = () => {
        const newCard = {
            heading: '', // Default heading
            cardList: [{ list: '' }] // Default cardList with one empty list item
        };

        setFormData((prev) => ({
            ...prev,
            content: {
                ...prev.content,
                processSection: {
                    ...prev.content.processSection,
                    cards: [...prev.content.processSection.cards, newCard] // Append the new card
                }
            }
        }));
    };


    const removeListItem = (cardIndex: number, listIndex: number, section: 'processSection') => {
        let updatedList: any;

        if (section === 'processSection') {
            updatedList = formData.content.processSection.cards[cardIndex].cardList.filter(
                (_, i) => i !== listIndex
            );
            setFormData((prev) => ({
                ...prev,
                content: {
                    ...prev.content,
                    processSection: {
                        ...prev.content.processSection,
                        cards: prev.content.processSection.cards.map((card, index) =>
                            index === cardIndex ? { ...card, cardList: updatedList } : card
                        ),
                    },
                },
            }));
        }
    };


    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
        section: 'heroSection' | 'uiSection1' | 'serviceSection' | 'uiSection2',
        index?: number
    ) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const payload = {
                folderName: process.env.NEXT_PUBLIC_AWS_FOLDER_CASESTUDIES,
                fileName: file.name,
                contentType: file.type
            };
    
            try {
                const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/media/signed-upload-url`, payload);
                if (resp.status === 200 || resp.status === 201) {
                    const response = await axios.put(resp?.data?.uploadUrl, file);
                    if (response.status === 200 || response.status === 201) {
                        const imageKey = resp?.data?.key;
    
                        // Update imageKey based on section
                        if (section === 'heroSection') {
                            setFormData((prev) => ({
                                ...prev,
                                content: {
                                    ...prev.content,
                                    caseheroSection: {
                                        ...prev.content.heroSection,
                                        imageKey
                                    }
                                }
                            }));
                        } else if (section === 'uiSection1') {
                            setFormData((prev) => ({
                                ...prev,
                                content: {
                                    ...prev.content,
                                    contentImage: imageKey // Just assign the imageKey directly
                                }
                            }));
                        } else if (section === 'serviceSection') {
                            setFormData((prev) => ({
                                ...prev,
                                content: {
                                    ...prev.content,
                                    serviceSection: {
                                        ...prev.content.serviceSection,
                                        imageKey
                                    }
                                }
                            }));
                        } else if (section === 'uiSection2') {
                            setFormData((prev) => ({
                                ...prev,
                                content: {
                                    ...prev.content,
                                    uiSection2: {
                                        ...prev.content.uiSection2,
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
    

    const handleSectionChange = (
        section: 'heroSection' | 'aboutSection' | 'serviceSection' | 'processSection' | 'uiSection2' | 'challengesSection',
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
        section: 'aboutSection' | 'processSection' | 'challengesSection',
        field: 'heading' | 'description' | 'list',
        value: string
    ) => {
        let updatedCards: any;
        let updatedList: any;

        if (section === 'aboutSection') {
            // Handling the `aboutCards` array inside `about`
            updatedCards = [...formData.content.aboutSection.aboutCards];
            updatedCards[index] = {
                ...updatedCards[index],
                [field]: value
            };
            setFormData((prev) => ({
                ...prev,
                content: {
                    ...prev.content,
                    aboutSection: {
                        ...prev.content.aboutSection,
                        aboutCards: updatedCards
                    }
                }
            }));
        } else if (section === 'processSection') {
            updatedCards = [...formData.content.processSection.cards];
    
            if (field === 'heading') {
                updatedCards[index] = {
                    ...updatedCards[index],
                    heading: value 
                };
            } else if (field === 'list') {
                updatedCards[index] = {
                    ...updatedCards[index],
                    cardList: updatedCards[index].cardList.map((item: any, cardIndex: number) =>
                        cardIndex === index ? { ...item, list: value } : item 
                    )
                };
            }
    
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
        }  else if (section === 'challengesSection') {
            updatedList = [...formData.content.challengesSection.StudyChallangeList];
            updatedList[index] = {
                ...updatedList[index],
                [field]: value
            };
            setFormData((prev) => ({
                ...prev,
                content: {
                    ...prev.content,
                    challange: {
                        ...prev.content.challengesSection,
                        StudyChallangeList: updatedList
                    }
                }
            }));
        }
    };

    const handleListItemChange = (
        cardIndex: number,
        listIndex: number,
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            content: {
                ...prev.content,
                processSection: {
                    ...prev.content.processSection,
                    cards: prev.content.processSection.cards.map((card, index) => {
                        if (index === cardIndex) {
                            const updatedCardList = card.cardList.map((listItem, listItemIndex) => {
                                if (listItemIndex === listIndex) {
                                    return { ...listItem, list: value };  
                                }
                                return listItem; 
                            });
                            return { ...card, cardList: updatedCardList }; 
                        }
                        return card;  
                    }),
                },
            },
        }));
    };


    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')  
            .replace(/(^-|-$)+/g, '');     
    };

    useEffect(() => {
        if (formData.title) {
            const generatedSlug = generateSlug(formData.title);
            setFormData((prevData) => ({
                ...prevData,
                slug: generatedSlug
            }));
        }
        else {
            setFormData((prevData) => ({
                ...prevData,
                slug: '',
            }));
        }
    }, [formData.title]);

    return (
        <div className="min-h-screen mt-10 text-white px-6 sm:px-8 md:px-12 lg:px-16">
            <form >
                <label className="w-full flex flex-col gap-2 mb-5">
                    <span>Title</span>
                    <input
                        type="text"
                        className="w-full bg-[#1A1A1A] px-4 py-2 rounded-lg outline-none border-none"
                        id="title"
                        placeholder="Enter title"
                        value={formData.title}
                        onChange={handleChange}

                        maxLength={120}
                        required
                    />
                </label>

                <div className='flex flex-row gap-5 items-end'>
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
                </div>
                <label className="block text-white mb-5">
                    <span className='text-xl'>Hero Section </span>
                    <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md mt-2">
                        {/* Image Upload */}
                        <div className="mb-6">
                            <label className="block text-gray-300 mb-2">Upload Image</label>
                            <label
                                className="relative w-full h-48 bg-[#222222] border-2 border-gray-600 rounded-lg flex justify-center items-center cursor-pointer"
                                htmlFor="mainImage"
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
                                id="mainImage"
                                className="hidden"
                                onChange={(e) => handleImageChange(e, 'heroSection')}

                            />
                        </div>
                    </div>
                </label>


                <label className="block text-white mb-5">
                    <span className='text-xl'>About Section</span>
                    <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md mt-2">
                        {/* Hero Section Fields */}
                        <div className="mb-4">
                            <label htmlFor="heading" className="block text-gray-300 mb-2">
                                Heading
                            </label>
                            <input
                                type="text"
                                id="heading"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Sub Heading"
                                value={formData.content.aboutSection.heading}
                                onChange={(e) => handleSectionChange('aboutSection', 'heading', e.target.value)}
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
                                value={formData.content.aboutSection.description}
                                onChange={(e) => handleSectionChange('aboutSection', 'description', e.target.value)}

                                rows={4}
                                required
                            />
                        </div>
                        {/* Cards Section */}
                        {formData.content.aboutSection.aboutCards.map((card, index) => (
                            <div key={index} className="bg-[#222222] p-4 rounded-lg mb-4 relative">
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 text-red-500"
                                    onClick={() => removeCard(index, 'aboutSection')}
                                >
                                    <span className="text-xl">×</span> 
                                </button>
                                <div className="mb-4">
                                    <p className='mb-2 text-lg'>Card-{index + 1}</p>
                                    <label htmlFor={`service-card-heading-${index}`} className="block text-gray-300 mb-2">
                                        Heading
                                    </label>
                                    <input
                                        type="text"
                                        id={`card-heading-${index}`}
                                        className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#333333] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter Heading"
                                        value={card.heading}
                                        onChange={(e) => handleCardChange(index, 'aboutSection', 'heading', e.target.value)}
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
                                        onChange={(e) => handleCardChange(index, 'aboutSection', 'description', e.target.value)}
                                        rows={3}
                                        required
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


                <label className="block text-white mb-5">
                    <span className='text-xl'>UI Section </span>
                    <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md mt-2">
                        {/* Image Upload */}
                        <div className="mb-6">
                            <label className="block text-gray-300 mb-2">Upload Image</label>
                            <label
                                className="relative w-full h-48 bg-[#222222] border-2 border-gray-600 rounded-lg flex justify-center items-center cursor-pointer"
                                htmlFor="contentImage"
                            >
                                {formData.content.uiSection1 ? (
                                    <img
                                        src={getURL(formData.content.uiSection1)}
                                        alt="Preview"
                                        className="object-contain w-full h-full rounded-lg"
                                    />
                                ) : (
                                    <span className="text-white text-3xl">+</span>
                                )}
                            </label>
                            <input
                                type="file"
                                id="contentImage"
                                className="hidden"
                                onChange={(e) => handleImageChange(e, 'uiSection1')}


                            />
                        </div>
                    </div>
                </label>

                <label className="block text-white mb-5">
                    <span className='text-xl'>Service Section</span>
                    <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md mt-2">
                        {/* Image Upload */}
                        <div className="mb-6">
                            <label className="block text-gray-300 mb-2">Upload Image</label>
                            <label
                                className="relative w-full h-48 bg-[#222222] border-2 border-gray-600 rounded-lg flex justify-center items-center cursor-pointer"
                                htmlFor="contentImageSection"
                            >
                                {formData.content.serviceSection.imageKey ? (
                                    <img
                                        src={getURL(formData.content.serviceSection.imageKey)}
                                        alt="Preview"
                                        className="object-contain w-full h-full rounded-lg"
                                    />
                                ) : (
                                    <span className="text-white text-3xl">+</span>
                                )}
                            </label>
                            <input
                                type="file"
                                id="contentImageSection"
                                className="hidden"
                                onChange={(e) => handleImageChange(e, 'serviceSection')}


                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="heading" className="block text-gray-300 mb-2">
                                Heading
                            </label>
                            <input
                                type="text"
                                id="heading"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Sub Heading"
                                value={formData.content.serviceSection.heading}
                                onChange={(e) => handleSectionChange('serviceSection', 'heading', e.target.value)}
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
                                value={formData.content.serviceSection.description}
                                onChange={(e) => handleSectionChange('serviceSection', 'description', e.target.value)}
                                rows={4}
                                required
                            />
                        </div>
                    </div>
                </label>

                <label className="block text-white mb-5">
    <span className="text-xl">Process Section</span>
    <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md mt-2">
        <div className="mb-4">
            <label htmlFor="heading" className="block text-gray-300 mb-2">
                Heading
            </label>
            <input
                type="text"
                id="heading"
                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Sub Heading"
                value={formData.content.processSection.heading}
                onChange={(e) => handleSectionChange('processSection', 'heading', e.target.value)}
                required
            />
        </div>
        {/* Cards Section */}
        {formData.content.processSection.cards.map((card, index) => (
            <div key={index} className="bg-[#222222] p-4 rounded-lg mb-4 relative">
                {/* Remove the card from processSection */}
                <button
                    type="button"
                    className="absolute top-2 right-2 text-red-500"
                    onClick={() => removeCard(index, 'processSection')} 
                >
                    <span className="text-xl">×</span> 
                </button>

                <div className="mb-4">
                    <p className="mb-2 text-lg">Card-{index + 1}</p>
                    <label htmlFor={`card-heading-${index}`} className="block text-gray-300 mb-2">
                        Heading
                    </label>
                    <input
                        type="text"
                        id={`card-heading-${index}`}
                        className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#333333] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Heading"
                        value={card.heading}
                        onChange={(e) => handleCardChange(index, 'processSection', 'heading', e.target.value)}
                        required
                    />
                </div>

                {/* List section for cardList */}
                <div className="mb-4">
                    <label htmlFor={`card-list-${index}`} className="block text-gray-300 mb-2">
                        List
                    </label>
                    {/* Only map over the current card's cardList */}
                    {card.cardList.map((listItem, listIndex) => (
                        <div key={listIndex} className="flex items-center justify-between mb-2">
                            <input
                                type="text"
                                id={`card-list-${index}-${listIndex}`}
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#333333] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter List Item"
                                value={listItem.list}
                                onChange={(e) => handleListItemChange(index, listIndex, e.target.value)} 
                                required
                            />
                            <button
                                type="button"
                                className="ml-2 text-red-500"
                                onClick={() => removeListItem(index, listIndex, 'processSection')} 
                            >
                                <span className="text-xl">×</span>
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="mt-2 text-blue-500"
                        onClick={() => addListItem(index, 'processSection')} 
                    >
                        Add Item
                    </button>
                </div>
            </div>
        ))}

        <button
            type="button"
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            onClick={processaddCard}
        >
            Add More
        </button>
    </div>
</label>



                <label className="block text-white mb-5">
                    <span className='text-xl'>UI Section 2</span>
                    <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md mt-2">
                        <div className="mb-4">
                            <label htmlFor="heading" className="block text-gray-300 mb-2">
                                Heading
                            </label>
                            <input
                                type="text"
                                id="Heading"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Sub Heading"
                                value={formData.content.uiSection2.heading}
                                onChange={(e) => handleSectionChange('uiSection2', 'heading', e.target.value)}
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
                                {formData.content.serviceSection.imageKey ? (
                                    <img
                                        src={formData.content.uiSection2.imageKey ? getURL(formData.content.uiSection2.imageKey) : undefined}
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
                                onChange={(e) => handleImageChange(e, 'uiSection2')}

                            />
                        </div>


                    </div>
                </label>


                <label className="block text-white mb-5">
                    <span className='text-xl'>Challanges Section</span>
                    <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md mt-2">
                        <div className="mb-4">
                            <label htmlFor="heading" className="block text-gray-300 mb-2">
                                Heading
                            </label>
                            <input
                                type="text"
                                id="heading"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Sub Heading"
                                value={formData.content.challengesSection.heading}
                                onChange={(e) => handleSectionChange('challengesSection', 'heading', e.target.value)}

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
                                value={formData.content.challengesSection.description}
                                onChange={(e) => handleSectionChange('challengesSection', 'description', e.target.value)}

                                rows={4}
                                required
                            />
                        </div>
                        {/* Cards Section */}
                        {formData.content.challengesSection.StudyChallangeList.map((card, index) => (
                            <div key={index} className="bg-[#222222] p-4 rounded-lg mb-4 relative">
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 text-red-500"
                                    onClick={() => removeCard(index, 'challengesSection')} 
                                >
                                    <span className="text-xl">×</span> 
                                </button>
                                <div className="mb-4">
                                    <p className='mb-2 text-lg'>Card-{index + 1}</p>
                                    <label htmlFor={`challange-card-heading-${index}`} className="block text-gray-300 mb-2">
                                        Heading
                                    </label>
                                    <input
                                        type="text"
                                        id={`challange-card-heading-${index}`}
                                        className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#333333] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter Heading"
                                        value={card.heading}
                                        onChange={(e) => handleCardChange(index, 'challengesSection', 'heading', e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor={`challange-card-description-${index}`} className="block text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        id={`challange-card-description-${index}`}
                                        className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#333333] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter Description"
                                        value={card.description}
                                        onChange={(e) => handleCardChange(index, 'challengesSection', 'description', e.target.value)}
                                        rows={3}
                                        required
                                    />
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            onClick={addCardChallange}
                        >
                            Add More
                        </button>
                    </div>
                </label>

                <button
                    type="submit"
                    className="px-6 py-3 mb-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                    Create CaseStudy
                </button>

            </form>
        </div>
    )
}

export default CreateCaseStudy