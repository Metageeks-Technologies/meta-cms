'use client';
import { INITIAL_CASESTUDY_CONTENT } from '@/constant/caseStudy';
import { caseStudyContent } from '@/types';
import { getURL } from '@/utils/AWS_Config';
import React, { useEffect, useState } from 'react';
import { aboutCard } from '@/types';
import axiosCall from '@/utils/ApiCall';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useUserContext } from '@/context/userContext';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';


const EditCaseStudy = () => {
    const [formData, setFormData] = useState<caseStudyContent>(
        INITIAL_CASESTUDY_CONTENT,
    );
    const [keywordValue, setKeywordValue] = useState('');
    const { setLoading, websiteKey } = useUserContext();
    const router = useRouter();

    const params = useParams();
    const slug = params.slug;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (id === 'slug') {
            const cleanedValue = value.toLowerCase().replace(/[^a-z0-9-]/g, '');

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
            description: '',
        };
        setFormData((prev) => ({
            ...prev,
            content: {
                ...prev.content,
                aboutSection: {
                    ...prev.content.aboutSection,
                    cards: [...prev.content.aboutSection.cards, newCard],
                },
            },
        }));
    };

    const addCardChallange = () => {
        const newCard: aboutCard = {
            heading: '',
            description: '',
        };
        setFormData((prev) => ({
            ...prev,
            content: {
                ...prev.content,
                challengesSection: {
                    ...prev.content.challengesSection,
                    cards: [...prev.content.challengesSection.cards, newCard],
                },
            },
        }));
    };

    const removeCard = (
        index: number,
        section: 'aboutSection' | 'processSection' | 'challengesSection',
    ) => {
        let updatedCards: any;

        if (section === 'aboutSection') {
            updatedCards = formData.content.aboutSection.cards.filter(
                (_, i) => i !== index,
            );
            setFormData((prev) => ({
                ...prev,
                content: {
                    ...prev.content,
                    aboutSection: {
                        ...prev.content.aboutSection,
                        cards: updatedCards, // Correctly update aboutCards
                    },
                },
            }));
        } else if (section === 'processSection') {
            updatedCards = formData.content.processSection.cards.filter(
                (_, i) => i !== index,
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
            updatedCards = formData.content.challengesSection.cards.filter(
                (_, i) => i !== index,
            );
            setFormData((prev) => ({
                ...prev,
                content: {
                    ...prev.content,
                    challengesSection: {
                        ...prev.content.challengesSection,
                        cards: updatedCards, // Correctly update StudyChallangeList
                    },
                },
            }));
        }
    };
    const handleKeywordchange = (value: string) => {
        setKeywordValue(value);
        const keywordArr = value
            .split(',')
            .map((keyword: string) => keyword.trim())
            .filter((keyword) => keyword.length > 0);
        setFormData((prev) => ({ ...prev, keywords: keywordArr }));
    };
    // Function to handle OG image upload
    const handleOgImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        const payload = {
            folderName: process.env.NEXT_PUBLIC_AWS_FOLDER_CASESTUDIES,
            fileName: file.name,
            contentType: file.type,
        };

        try {
            const resp = await axiosCall(
                'post',
                `${process.env.NEXT_PUBLIC_BASE_URL}/media/signed-upload-url`,
                payload,
                { websiteKey },
            );

            if (resp.status === 200 || resp.status === 201) {
                const response = await axios.put(resp?.data?.uploadUrl, file);
                if (response.status === 200 || response.status === 201) {
                    const imageKey = resp?.data?.key;

                    setFormData((prev) => ({
                        ...prev,
                        ogImageKey: imageKey,
                    }));
                }
            } else {
                toast.error(resp?.data?.message || 'Failed to get upload URL', {
                    duration: 2000,
                });
            }
        } catch (error) {
            console.error('OG Image upload error:', error);
            toast.error('Failed to upload the OG image', { duration: 2000 });
        }
    };

    const addListItem = (cardIndex: number, section: 'processSection') => {
        if (section === 'processSection') {
            const newListItem: string = '';
            setFormData((prev) => ({
                ...prev,
                content: {
                    ...prev.content,
                    processSection: {
                        ...prev.content.processSection,
                        cards: prev.content.processSection.cards.map(
                            (card, index) =>
                                index === cardIndex
                                    ? {
                                          ...card,
                                          list: [...card.list, newListItem],
                                      }
                                    : card,
                        ),
                    },
                },
            }));
        }
    };

    const processaddCard = () => {
        const newCard = {
            heading: '',
            list: [],
        };

        setFormData((prev) => ({
            ...prev,
            content: {
                ...prev.content,
                processSection: {
                    ...prev.content.processSection,
                    cards: [...prev.content.processSection.cards, newCard], // Append the new card
                },
            },
        }));
    };

    const removeListItem = (
        cardIndex: number,
        listIndex: number,
        section: 'processSection',
    ) => {
        let updatedList: any;

        if (section === 'processSection') {
            updatedList = formData.content.processSection.cards[
                cardIndex
            ].list.filter((_, i) => i !== listIndex);
            setFormData((prev) => ({
                ...prev,
                content: {
                    ...prev.content,
                    processSection: {
                        ...prev.content.processSection,
                        cards: prev.content.processSection.cards.map(
                            (card, index) =>
                                index === cardIndex
                                    ? { ...card, list: updatedList }
                                    : card,
                        ),
                    },
                },
            }));
        }
    };

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
        section: 'heroSection' | 'uiSection' | 'serviceSection' | 'uiSection2',
        index?: number,
    ) => {
        if (!e.target.files || e.target.files.length === 0) return; // Fallback if no files are selected
        const file = e.target.files[0];

        const payload = {
            folderName: process.env.NEXT_PUBLIC_AWS_FOLDER_CASESTUDIES,
            fileName: file.name,
            contentType: file.type,
        };

        try {
            const resp = await axiosCall(
                'post',
                `${process.env.NEXT_PUBLIC_BASE_URL}/media/signed-upload-url`,
                payload,
                { websiteKey },
            );

            if (resp.status === 200 || resp.status === 201) {
                const response = await axios.put(resp?.data?.uploadUrl, file);
                if (response.status === 200 || response.status === 201) {
                    const imageKey = resp?.data?.key;

                    // Ensure formData is updated correctly for the selected section
                    setFormData((prev) => {
                        const updatedContent = { ...prev.content };

                        if (section === 'heroSection') {
                            updatedContent.heroSection = {
                                ...updatedContent.heroSection,
                                imageKey,
                            };
                        } else if (section === 'uiSection') {
                            updatedContent.uiSection = {
                                ...updatedContent.uiSection,
                                imageKey,
                            };
                        } else if (section === 'serviceSection') {
                            updatedContent.serviceSection = {
                                ...updatedContent.serviceSection,
                                imageKey,
                            };
                        } else if (section === 'uiSection2') {
                            updatedContent.uiSection2 = {
                                ...updatedContent.uiSection2,
                                imageKey,
                            };
                        }

                        return { ...prev, content: updatedContent };
                    });
                }
            } else {
                toast.error(resp?.data?.message || 'Failed to get upload URL', {
                    duration: 2000,
                });
            }
        } catch (error) {
            console.error('Image upload error:', error);
            toast.error('Failed to upload the image', { duration: 2000 });
        }
    };

    const handleSectionChange = (
        section:
            | 'heroSection'
            | 'aboutSection'
            | 'serviceSection'
            | 'processSection'
            | 'uiSection2'
            | 'challengesSection',
        field: string,
        value: string,
    ) => {
        setFormData((prev) => ({
            ...prev,
            content: {
                ...prev.content,
                [section]: {
                    ...prev.content[section],
                    [field]: value,
                },
            },
        }));
    };

    const handleCardChange = (
        index: number,
        section: 'aboutSection' | 'processSection' | 'challengesSection',
        field: 'heading' | 'description' | 'list',
        value: string,
    ) => {
        let updatedCards: any;
        let updatedList: any;

        if (section === 'aboutSection') {
            // Handling the `aboutCards` array inside `about`
            updatedCards = [...formData.content.aboutSection.cards];
            updatedCards[index] = {
                ...updatedCards[index],
                [field]: value,
            };
            setFormData((prev) => ({
                ...prev,
                content: {
                    ...prev.content,
                    aboutSection: {
                        ...prev.content.aboutSection,
                        cards: updatedCards,
                    },
                },
            }));
        } else if (section === 'processSection') {
            updatedCards = [...formData.content.processSection.cards];

            if (field === 'heading') {
                updatedCards[index] = {
                    ...updatedCards[index],
                    heading: value,
                };
            } else if (field === 'list') {
                updatedCards[index] = {
                    ...updatedCards[index],
                    list: updatedCards[index].list.map(
                        (item: any, cardIndex: number) =>
                            cardIndex === index
                                ? { ...item, list: value }
                                : item,
                    ),
                };
            }

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
            updatedList = [...formData.content.challengesSection.cards];
            updatedList[index] = {
                ...updatedList[index],
                [field]: value,
            };
            setFormData((prev) => ({
                ...prev,
                content: {
                    ...prev.content,
                    challengesSection: {
                        // Corrected this key
                        ...prev.content.challengesSection,
                        cards: updatedList,
                    },
                },
            }));
        }
    };

    const handleListItemChange = (
        cardIndex: number,
        listIndex: number,
        value: string,
    ) => {
        setFormData((prev) => ({
            ...prev,
            content: {
                ...prev.content,
                processSection: {
                    ...prev.content.processSection,
                    cards: prev.content.processSection.cards.map(
                        (card, index) =>
                            index === cardIndex
                                ? {
                                      ...card,
                                      list: card.list.map((item, listIdx) =>
                                          listIdx === listIndex
                                              ? value // Set the value directly as a string
                                              : item,
                                      ),
                                  }
                                : card,
                    ),
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
                slug: generatedSlug,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                slug: '',
            }));
        }
    }, [formData.title]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!formData.content.heroSection?.imageKey) {
            toast.error('Hero section image is required', { duration: 2000 });
            return;
        }
        if (!formData.content.uiSection?.imageKey) {
            toast.error('UI section 1 image is required', { duration: 2000 });
            return;
        }
        if (!formData.content.serviceSection?.imageKey) {
            toast.error('Service section image is required', {
                duration: 2000,
            });
            return;
        }
        if (!formData.content.uiSection2?.imageKey) {
            toast.error('UI section 2 image is required', { duration: 2000 });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                title: formData.title,
                slug: formData.slug,
                projectType: formData.projectType,
                metaTitle: formData.metaTitle || '',
                metaDescription: formData.metaDescription || '',
                keywords: formData.keywords || [],
                ogTitle: formData.ogTitle || '',
                ogDescription: formData.ogDescription || '',
                ogImageKey: formData.ogImageKey || '',
                content: formData.content,
            };

            const resp = await axiosCall(
                'put',
                `${process.env.NEXT_PUBLIC_BASE_URL}/caseStudy/${formData._id}`,
                payload,
                { websiteKey },
            );

            if (resp.status === 200 || resp.status === 201) {
                toast.success(resp.data.message, { duration: 2000 });

                setLoading(false);

                const fetchUpdatedCaseStudy = async () => {
                    const pageResp = await axiosCall(
                        'get',
                        `${process.env.NEXT_PUBLIC_BASE_URL}/caseStudy/${formData.slug}`,
                        undefined,
                        { websiteKey },
                    );

                    if (pageResp.status === 200) {
                        router.push(`/caseStudy/${formData.slug}`);
                    } else {
                        router.push('/allCaseStudy');
                    }
                };

                fetchUpdatedCaseStudy();
            } else {
                toast.error(resp?.data?.message || 'Failed to update page', {
                    duration: 2000,
                });
            }
        } catch (error) {
            console.error('Error during page update:', error);
            toast.error('An error occurred while updating the page.', {
                duration: 2000,
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchCaseStudy = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall(
                'get',
                `${process.env.NEXT_PUBLIC_BASE_URL}/caseStudy/${slug}`,
                undefined,
                { websiteKey },
            );

            if (resp.status === 200 || resp.status === 201) {
                setFormData(resp?.data);
                setKeywordValue(resp?.data?.keyword.join(", "))
            } else {
                toast.error(resp.data.message, {
                    duration: 2000,
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (websiteKey) fetchCaseStudy();
    }, [websiteKey]);

    return (
        <div className="min-h-screen mt-10 text-white px-6 sm:px-8 md:px-12 lg:px-16">
            <form onSubmit={handleSubmit}>
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

                <div className="flex flex-row gap-5 items-end">
                    <label className="w-full flex flex-col gap-2 mb-5">
                        <span>Enter Slug</span>
                        <span className="text-xs italic text-gray-400 -mt-3">
                            (Contain only lowercase letters, numbers, hyphens,
                            and underscores)
                        </span>
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

                <label className="w-full flex flex-col gap-2 mb-5">
                    <span>Project Type</span>
                    <input
                        type="text"
                        className="w-full bg-[#1A1A1A] px-4 py-2 rounded-lg outline-none border-none"
                        id="projectType"
                        placeholder="Enter project type"
                        value={formData.projectType}
                        onChange={handleChange}
                        maxLength={120}
                        required
                    />
                </label>

                <label className="block text-white mb-5">
                    <span className="text-xl">Hero Section </span>
                    <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md mt-2">
                        {/* Image Upload */}
                        <div className="mb-6">
                            <label className="block text-gray-300 mb-2">
                                Upload Image
                            </label>
                            <label
                                className="relative w-full h-48 bg-[#222222] border-2 border-gray-600 rounded-lg flex justify-center items-center cursor-pointer"
                                htmlFor="mainImage"
                            >
                                {formData.content.heroSection?.imageKey ? (
                                    <Image
                                        src={getURL(
                                            formData.content.heroSection
                                                ?.imageKey,
                                        )}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-lg"
                                        width={1200}
                                        height={800}
                                    />
                                ) : (
                                    <span className="text-white text-3xl">
                                        +
                                    </span>
                                )}
                            </label>
                            <input
                                type="file"
                                id="mainImage"
                                className="hidden"
                                onChange={(e) =>
                                    handleImageChange(e, 'heroSection')
                                }
                            />
                        </div>
                    </div>
                </label>

                <label className="block text-white mb-5">
                    <span className="text-xl">About Section</span>
                    <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md mt-2">
                        {/* Hero Section Fields */}
                        <div className="mb-4">
                            <label
                                htmlFor="heading"
                                className="block text-gray-300 mb-2"
                            >
                                Heading
                            </label>
                            <input
                                type="text"
                                id="heading"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Heading"
                                value={formData.content.aboutSection?.heading}
                                onChange={(e) =>
                                    handleSectionChange(
                                        'aboutSection',
                                        'heading',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="description"
                                className="block  text-gray-300 mb-2"
                            >
                                Description
                            </label>
                            <textarea
                                id="description"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Description"
                                value={
                                    formData.content.aboutSection?.description
                                }
                                onChange={(e) =>
                                    handleSectionChange(
                                        'aboutSection',
                                        'description',
                                        e.target.value,
                                    )
                                }
                                rows={4}
                                required
                            />
                        </div>
                        {/* Cards Section */}
                        {formData.content.aboutSection.cards.map(
                            (card, index) => (
                                <div
                                    key={index}
                                    className="bg-[#222222] p-4 rounded-lg mb-4 relative"
                                >
                                    <button
                                        type="button"
                                        className="absolute top-2 right-2 text-red-500"
                                        onClick={() =>
                                            removeCard(index, 'aboutSection')
                                        }
                                    >
                                        <span className="text-xl">×</span>
                                    </button>
                                    <div className="mb-4">
                                        <p className="mb-2 text-lg">
                                            Card-{index + 1}
                                        </p>
                                        <label
                                            htmlFor={`service-card-heading-${index}`}
                                            className="block text-gray-300 mb-2"
                                        >
                                            Heading
                                        </label>
                                        <input
                                            type="text"
                                            id={`card-heading-${index}`}
                                            className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#333333] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter Heading"
                                            value={card?.heading}
                                            onChange={(e) =>
                                                handleCardChange(
                                                    index,
                                                    'aboutSection',
                                                    'heading',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label
                                            htmlFor={`service-card-description-${index}`}
                                            className="block text-gray-300 mb-2"
                                        >
                                            Description
                                        </label>
                                        <textarea
                                            id={`card-description-${index}`}
                                            className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#333333] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter Description"
                                            value={card?.description}
                                            onChange={(e) =>
                                                handleCardChange(
                                                    index,
                                                    'aboutSection',
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            rows={3}
                                            required
                                        />
                                    </div>
                                </div>
                            ),
                        )}
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
                    <span className="text-xl">UI Section </span>
                    <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md mt-2">
                        {/* Image Upload */}
                        <div className="mb-6">
                            <label className="block text-gray-300 mb-2">
                                Upload Image
                            </label>
                            <label
                                className="relative w-full h-48 bg-[#222222] border-2 border-gray-600 rounded-lg flex justify-center items-center cursor-pointer"
                                htmlFor="contentImage"
                            >
                                {formData.content.uiSection?.imageKey ? (
                                    <Image
                                        src={getURL(
                                            formData.content.uiSection
                                                ?.imageKey,
                                        )}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-lg"
                                        width={1200}
                                        height={800}
                                    />
                                ) : (
                                    <span className="text-white text-3xl">
                                        +
                                    </span>
                                )}
                            </label>
                            <input
                                type="file"
                                id="contentImage"
                                className="hidden"
                                onChange={(e) =>
                                    handleImageChange(e, 'uiSection')
                                }
                            />
                        </div>
                    </div>
                </label>

                <label className="block text-white mb-5">
                    <span className="text-xl">Service Section</span>
                    <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md mt-2">
                        <div className="mb-4">
                            <label
                                htmlFor="description"
                                className="block  text-gray-300 mb-2"
                            >
                                Description
                            </label>
                            <textarea
                                id="description"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Description"
                                value={
                                    formData.content.serviceSection?.description
                                }
                                onChange={(e) =>
                                    handleSectionChange(
                                        'serviceSection',
                                        'description',
                                        e.target.value,
                                    )
                                }
                                rows={4}
                                required
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="mb-6">
                            <label className="block text-gray-300 mb-2">
                                Upload Image
                            </label>
                            <label
                                className="relative w-full h-48 bg-[#222222] border-2 border-gray-600 rounded-lg flex justify-center items-center cursor-pointer"
                                htmlFor="contentImageSection"
                            >
                                {formData.content.serviceSection?.imageKey ? (
                                    <Image
                                        src={getURL(
                                            formData.content.serviceSection
                                                ?.imageKey,
                                        )}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-lg"
                                        width={1200}
                                        height={800}
                                    />
                                ) : (
                                    <span className="text-white text-3xl">
                                        +
                                    </span>
                                )}
                            </label>
                            <input
                                type="file"
                                id="contentImageSection"
                                className="hidden"
                                onChange={(e) =>
                                    handleImageChange(e, 'serviceSection')
                                }
                            />
                        </div>
                    </div>
                </label>

                <label className="block text-white mb-5">
                    <span className="text-xl">Process Section</span>
                    <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md mt-2">
                        <div className="mb-4">
                            <label
                                htmlFor="heading"
                                className="block text-gray-300 mb-2"
                            >
                                Heading
                            </label>
                            <input
                                type="text"
                                id="heading"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter  Heading"
                                value={formData.content.processSection?.heading}
                                onChange={(e) =>
                                    handleSectionChange(
                                        'processSection',
                                        'heading',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                        </div>
                        {/* Cards Section */}
                        {formData.content.processSection.cards.map(
                            (card, index) => (
                                <div
                                    key={index}
                                    className="bg-[#222222] p-4 rounded-lg mb-4 relative"
                                >
                                    {/* Remove the card from processSection */}
                                    <button
                                        type="button"
                                        className="absolute top-2 right-2 text-red-500"
                                        onClick={() =>
                                            removeCard(index, 'processSection')
                                        }
                                    >
                                        <span className="text-xl">×</span>
                                    </button>

                                    <div className="mb-4">
                                        <p className="mb-2 text-lg">
                                            Card-{index + 1}
                                        </p>
                                        <label
                                            htmlFor={`card-heading-${index}`}
                                            className="block text-gray-300 mb-2"
                                        >
                                            Heading
                                        </label>
                                        <input
                                            type="text"
                                            id={`card-heading-${index}`}
                                            className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#333333] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter Heading"
                                            value={card?.heading}
                                            onChange={(e) =>
                                                handleCardChange(
                                                    index,
                                                    'processSection',
                                                    'heading',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </div>

                                    {/* List section for cardList */}
                                    <div className="mb-4">
                                        <label
                                            htmlFor={`card-list-${index}`}
                                            className="block text-gray-300 mb-2"
                                        >
                                            List
                                        </label>
                                        {/* Only map over the current card's cardList */}
                                        {card.list.map(
                                            (listItem, listIndex) => (
                                                <div
                                                    key={listIndex}
                                                    className="flex items-center justify-between mb-2"
                                                >
                                                    <input
                                                        type="text"
                                                        id={`card-list-${index}-${listIndex}`}
                                                        className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#333333] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Enter List Item"
                                                        value={listItem}
                                                        onChange={(e) =>
                                                            handleListItemChange(
                                                                index,
                                                                listIndex,
                                                                e.target.value,
                                                            )
                                                        }
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        className="ml-2 text-red-500"
                                                        onClick={() =>
                                                            removeListItem(
                                                                index,
                                                                listIndex,
                                                                'processSection',
                                                            )
                                                        }
                                                    >
                                                        <span className="text-xl">
                                                            ×
                                                        </span>
                                                    </button>
                                                </div>
                                            ),
                                        )}
                                        <button
                                            type="button"
                                            className="mt-2 text-blue-500"
                                            onClick={() =>
                                                addListItem(
                                                    index,
                                                    'processSection',
                                                )
                                            }
                                        >
                                            Add Item
                                        </button>
                                    </div>
                                </div>
                            ),
                        )}

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
                    <span className="text-xl">UI Section 2</span>
                    <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md mt-2">
                        <div className="mb-4">
                            <label
                                htmlFor="heading"
                                className="block text-gray-300 mb-2"
                            >
                                Heading
                            </label>
                            <input
                                type="text"
                                id="Heading"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter  Heading"
                                value={formData.content.uiSection2?.heading}
                                onChange={(e) =>
                                    handleSectionChange(
                                        'uiSection2',
                                        'heading',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                        </div>
                        {/* Image Upload */}
                        <div className="mb-6">
                            <label className="block text-gray-300 mb-2">
                                Upload Image
                            </label>
                            <label
                                className="relative w-full h-48 bg-[#222222] border-2 border-gray-600 rounded-lg flex justify-center items-center cursor-pointer"
                                htmlFor="imageInputSolution2"
                            >
                                {formData.content.serviceSection?.imageKey ? (
                                    <img
                                        src={
                                            formData.content.uiSection2
                                                ?.imageKey
                                                ? getURL(
                                                      formData.content
                                                          .uiSection2?.imageKey,
                                                  )
                                                : undefined
                                        }
                                        alt="Preview"
                                        className="object-contain w-full h-full rounded-lg"
                                    />
                                ) : (
                                    <span className="text-white text-3xl">
                                        +
                                    </span>
                                )}
                            </label>
                            <input
                                type="file"
                                id="imageInputSolution2"
                                className="hidden"
                                onChange={(e) =>
                                    handleImageChange(e, 'uiSection2')
                                }
                            />
                        </div>
                    </div>
                </label>

                <label className="block text-white mb-5">
                    <span className="text-xl">Challanges Section</span>
                    <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md mt-2">
                        <div className="mb-4">
                            <label
                                htmlFor="heading"
                                className="block text-gray-300 mb-2"
                            >
                                Heading
                            </label>
                            <input
                                type="text"
                                id="heading"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter  Heading"
                                value={
                                    formData.content.challengesSection?.heading
                                }
                                onChange={(e) =>
                                    handleSectionChange(
                                        'challengesSection',
                                        'heading',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="description"
                                className="block  text-gray-300 mb-2"
                            >
                                Description
                            </label>
                            <textarea
                                id="description"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Description"
                                value={
                                    formData.content.challengesSection
                                        ?.description
                                }
                                onChange={(e) =>
                                    handleSectionChange(
                                        'challengesSection',
                                        'description',
                                        e.target.value,
                                    )
                                }
                                rows={4}
                                required
                            />
                        </div>
                        {/* Cards Section */}
                        {formData.content.challengesSection.cards.map(
                            (card, index) => (
                                <div
                                    key={index}
                                    className="bg-[#222222] p-4 rounded-lg mb-4 relative"
                                >
                                    <button
                                        type="button"
                                        className="absolute top-2 right-2 text-red-500"
                                        onClick={() =>
                                            removeCard(
                                                index,
                                                'challengesSection',
                                            )
                                        }
                                    >
                                        <span className="text-xl">×</span>
                                    </button>
                                    <div className="mb-4">
                                        <p className="mb-2 text-lg">
                                            Card-{index + 1}
                                        </p>
                                        <label
                                            htmlFor={`challange-card-heading-${index}`}
                                            className="block text-gray-300 mb-2"
                                        >
                                            Heading
                                        </label>
                                        <input
                                            type="text"
                                            id={`challange-card-heading-${index}`}
                                            className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#333333] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter Heading"
                                            value={card?.heading}
                                            onChange={(e) =>
                                                handleCardChange(
                                                    index,
                                                    'challengesSection',
                                                    'heading',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label
                                            htmlFor={`challange-card-description-${index}`}
                                            className="block text-gray-300 mb-2"
                                        >
                                            Description
                                        </label>
                                        <textarea
                                            id={`challange-card-description-${index}`}
                                            className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#333333] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter Description"
                                            value={card?.description}
                                            onChange={(e) =>
                                                handleCardChange(
                                                    index,
                                                    'challengesSection',
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            rows={3}
                                            required
                                        />
                                    </div>
                                </div>
                            ),
                        )}

                        <button
                            type="button"
                            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            onClick={addCardChallange}
                        >
                            Add More
                        </button>
                    </div>
                </label>
                <label className="block text-white mb-5">
                    <span className="text-xl">Meta Details</span>

                    <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md mt-2">
                        {/* Meta Title */}
                        <div className="mb-4">
                            <label
                                htmlFor="metaTitle"
                                className="block text-gray-300 mb-2"
                            >
                                Meta Title
                            </label>
                            <input
                                type="text"
                                id="metaTitle"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Meta Title"
                                value={formData.metaTitle || ''}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        metaTitle: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        {/* Meta Description */}
                        <div className="mb-4">
                            <label
                                htmlFor="metaDescription"
                                className="block text-gray-300 mb-2"
                            >
                                Meta Description
                            </label>
                            <textarea
                                id="metaDescription"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Meta Description"
                                value={formData.metaDescription || ''}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        metaDescription: e.target.value,
                                    }))
                                }
                                rows={3}
                            />
                        </div>

                        {/* Keywords */}
                        <div className="mb-4">
                            <label
                                htmlFor="keywords"
                                className="block text-gray-300 mb-2"
                            >
                                Keywords{' '}
                                <span className="text-sm italic text-gray-400">
                                    (separated by commas)
                                </span>
                            </label>
                            <input
                                type="text"
                                id="keywords"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Keywords"
                                value={keywordValue} // Use keywordInput instead of formData.keywords.join
                                onChange={(e) =>
                                    handleKeywordchange(e.target.value)
                                }
                            />
                        </div>

                        {/* OG Title */}
                        <div className="mb-4">
                            <label
                                htmlFor="ogTitle"
                                className="block text-gray-300 mb-2"
                            >
                                Open Graph Title
                            </label>
                            <input
                                type="text"
                                id="ogTitle"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Open Graph Title"
                                value={formData.ogTitle || ''}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        ogTitle: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        {/* OG Description */}
                        <div className="mb-4">
                            <label
                                htmlFor="ogDescription"
                                className="block text-gray-300 mb-2"
                            >
                                Open Graph Description
                            </label>
                            <textarea
                                id="ogDescription"
                                className="w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-700 bg-[#222222] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Open Graph Description"
                                value={formData.ogDescription || ''}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        ogDescription: e.target.value,
                                    }))
                                }
                                rows={3}
                            />
                        </div>

                        {/* OG Image Upload */}
                        <div className="mb-6">
                            <label className="block text-gray-300 mb-2">
                                Open Graph Image
                            </label>
                            <label
                                className="relative w-full h-48 bg-[#222222] border-2 border-gray-600 rounded-lg flex justify-center items-center cursor-pointer overflow-hidden"
                                htmlFor="imageInputOG"
                            >
                                {formData.ogImageKey ? (
                                    <div className="relative w-full h-full">
                                        <div className="absolute inset-0 overflow-hidden">
                                            <Image
                                                src={getURL(
                                                    formData.ogImageKey,
                                                )}
                                                alt="Open Graph Preview"
                                                layout="fill"
                                                objectFit="contain"
                                                className="rounded-lg"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    ogImageKey: '',
                                                }));
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ) : (
                                    <span className="text-white text-3xl">
                                        +
                                    </span>
                                )}
                            </label>
                            <input
                                type="file"
                                id="imageInputOG"
                                className="hidden"
                                onChange={(e) => handleOgImageChange(e)}
                            />
                        </div>
                    </div>
                </label>

                <button
                    type="submit"
                    className="px-6 py-3 mb-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                    Update
                </button>
            </form>
        </div>
    );
};

export default EditCaseStudy;
