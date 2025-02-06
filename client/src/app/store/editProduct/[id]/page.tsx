'use client';
import { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useUserContext } from '@/context/userContext';
import axiosCall from '@/utils/ApiCall';
import toast from 'react-hot-toast';
import { CreateProductFormData, ProductVariant, ProductAttribute, ProductTypes } from '@/types';
import { Check } from 'lucide-react';
import axios from 'axios';
import { useParams, useRouter } from "next/navigation";
import DatePicker from 'react-datepicker';
import { FaArrowLeft } from 'react-icons/fa6';

const EditProduct: React.FC = () => {
    const [variantImages, setVariantImages] = useState<{ [key: string]: File[] }>({});
    const [productStatus, setProductStatus] = useState('DRAFT');
    const [attributes, setAttributes] = useState<{ name: string, value: string | number }[]>([{ name: '', value: '' }]); // Add one default attribute
    const [variants, setVariants] = useState<ProductVariant[]>([  // Add one default variant
        {
            variantId: '',
            sku: '',
            price: 0,
            discountedPrice: 0,
            quantity: 0,
            size: '',
            color: '',
            imageKeys: [],
        },
    ]);
    const editorRef = useRef<any>(null);
    const params = useParams();
    const router = useRouter();
    const id = params.id;
    const [product, setProduct] = useState<ProductTypes | null>(null);
    const { setLoading, user } = useUserContext();
    const [websiteArr, setWebsiteArr] = useState([]);
    const [categoryArr, setCategoryArr] = useState([]);
    const [filteredCategoryArr, setFilteredCategoryArr] = useState(categoryArr);
    const [formData, setFormData] = useState<CreateProductFormData>({
        title: "",
        subDescription: '',
        description: '',
        category: '',
        brand: '',
        website: '',
        status: 'draft',
        publishDate: null,

        attributes: {},
        variants: [],
    });

    // console.log(formData, "form data");

    // Fetch product categories
    const fetchCategory = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/product-categories`);
            if (resp.status === 200 || resp.status === 201) {
                setCategoryArr(resp?.data);
                setFilteredCategoryArr(resp?.data);
            } else {
                toast.error(resp.data.message, { duration: 2000 });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchWebsites = async () => {
        setLoading(true);
        try {
            const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/website`);
            if (resp.status === 200 || resp.status === 201) {
                setWebsiteArr(resp?.data);
            } else {
                toast.error(resp.data.message, { duration: 2000 });
            }
        } catch (error) {
            console.log("Error in fetching website data in new product section : ", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user.role) {
            fetchCategory();
            fetchWebsites();
        }
    }, [user]);

    const toggleCategory = (id: string) => {
        setFormData((prevData) => ({
            ...prevData,
            category: id, // Single category
        }));
    };

    const filterCategory = (query: string) => {
        setFilteredCategoryArr(categoryArr.filter((category: any) =>
            category.name.toLowerCase().includes(query.toLowerCase())
        ));
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axiosCall('GET', `${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`);

            // console.log(response.data)

            if (response.status === 200 || response.status === 201) {
                // console.log('Attributes:', response.data.attributes); // Check attributes
                // console.log('Variants:', response.data.variants);
                setProduct(response.data);
                setFormData({
                    title: response.data.title,
                    subDescription: response.data.subDescription,
                    description: response.data.description,
                    category: response.data.category,
                    brand: response.data.brand,
                    website: response.data.website,
                    status: response.data.status,
                    publishDate: response.data.publishedDate ? new Date(response.data.publishedDate) : null,
                    attributes: response.data.attributes || {},
                    variants: response.data.variants || [],
                })
            } else {
                toast.error(response.data.message, { duration: 2000 });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const addAttribute = () => {
        setAttributes([...attributes, { name: '', value: '' }]);
    };

    const removeAttribute = (index: number) => {
        const updatedAttributes = attributes.filter((_, i) => i !== index);
        setAttributes(updatedAttributes);
    };

    const handleAttributeChange = (index: number, field: 'name' | 'value', value: string | number) => {
        const updatedAttributes = [...attributes];
        updatedAttributes[index] = { ...updatedAttributes[index], [field]: value };

        setAttributes(updatedAttributes);

        // Now update the formData.attributes
        const newAttributes = updatedAttributes.reduce((acc, attribute) => {
            acc[attribute.name] = attribute.value; // Use attribute name as the key
            return acc;
        }, {} as { [key: string]: string | number });

        setFormData((prevFormData) => ({
            ...prevFormData,
            attributes: newAttributes,  // Update formData's attributes with the new object
        }));
    };

    const addVariant = () => {
        setVariants([
            ...variants,
            {
                variantId: '',
                sku: '',
                price: 0,
                discountedPrice: 0,
                quantity: 0,
                size: '',
                color: '',
                imageKeys: [],
            },
        ]);
    };

    const handleVariantChange = (index: number, field: string, value: string) => {
        const updatedVariants = [...variants];
        // Parse the values as numbers where needed
        if (field === 'price' || field === 'discountedPrice' || field === 'quantity') {
            updatedVariants[index] = {
                ...updatedVariants[index],
                [field]: value ? parseFloat(value) : 0,  // Default to 0 if value is empty
            };
        } else {
            updatedVariants[index] = { ...updatedVariants[index], [field]: value };
        }

        setVariants(updatedVariants);
        setFormData((prevFormData) => ({
            ...prevFormData,
            variants: updatedVariants,
        }));

    };

    const handleVariantImageChange = async (variantId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newVariantImages = Array.from(files);

            // Update state with newly selected images
            setVariantImages((prevImages) => ({
                ...prevImages,
                [variantId]: [...(prevImages[variantId] || []), ...newVariantImages],
            }));

            try {
                setLoading(true);
                const imageKeys: string[] = [];  // To store the image keys of uploaded images

                // Loop through each selected image and upload
                for (let i = 0; i < newVariantImages.length; i++) {
                    const file = newVariantImages[i];

                    const payload = {
                        folderName: process.env.NEXT_PUBLIC_AWS_FOLDER_PRODUCTCIMAGES,
                        fileName: file.name,
                        contentType: file.type,
                    };

                    const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/media/signed-upload-url`, payload);

                    if (resp.status === 200 || resp.status === 201) {
                        const uploadUrl = resp?.data?.uploadUrl;
                        const key = resp?.data?.key;


                        await axios.put(uploadUrl, file);

                        imageKeys.push(key);
                    } else {
                        toast.error(resp.data.message, { duration: 2000 });
                    }
                }
                // Once all images are uploaded, update the variant with the new image keys
                setVariants((prevVariants) => {
                    return prevVariants.map((variant) => {
                        if (variant.variantId === variantId) {
                            return {
                                ...variant,
                                imageKeys: [...variant.imageKeys, ...imageKeys],  // Append new image keys
                            };
                        }
                        return variant;
                    });
                });

                // Also update the formData to ensure the correct imageKeys are part of the payload
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    variants: prevFormData.variants.map((variant) => {
                        if (variant.variantId === variantId) {
                            return {
                                ...variant,
                                imageKeys: [...variant.imageKeys, ...imageKeys],  // Ensure that the formData has the correct image keys
                            };
                        }
                        return variant;
                    }),
                }));

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
    };

    interface PayloadType {
        title: string;
        subDescription: string;
        description: string;
        category: string;
        status: string;
        website: string;
        publishedDate?: Date,
        brand: string;
        attributes: ProductAttribute;
        variants: ProductVariant[];
    }

    const handleEditProduct = async () => {


        setLoading(true);
        try {
            const payload: PayloadType = {
                title: formData.title,
                subDescription: formData.subDescription,
                description: formData.description,
                category: formData.category,
                brand: formData.brand,
                website: formData.website,
                status: formData.status,
                attributes: formData.attributes,
                variants: formData.variants,
            };

            const resp = await axiosCall('put', `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product?._id}`, payload);

            if (resp.status === 200 || resp.status === 201) {
                toast.success('Post updated successfully!', { duration: 2000 });
                router.push(`/store/product/${product?._id}`);
                // Reset form data
                setFormData({
                    title: "",
                    subDescription: '',
                    description: '',
                    category: '',
                    brand: '',
                    website: '',
                    status: 'draft',
                    publishDate: null,
                    attributes: {},
                    variants: [],
                });
                fetchCategory(); // Re-fetch categories
            } else {
                toast.error(resp.data.message, { duration: 2000 });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    return (
        <div className='border-1 border-dashed border-gray-900 p-4 relative'>
            <div className='text-2xl cursor-pointer text-white -mt-2 mb-5' onClick={() => router.push('/store/allProduct')}>
                <FaArrowLeft />
            </div>
            <div className="bg-[#0A090F] border-[#414141] p-6 space-y-6 flex flex-col sm:flex-row gap-8 mx-auto">
                {/* Left side (Product title, description, and tags) */}
                <div className="w-full sm:w-[70%] flex flex-col space-y-9">
                    <div>
                        <label htmlFor="productTitle" className="text-white block mb-2">Product Title</label>
                        <input
                            type="text"
                            id="productTitle"
                            placeholder="Enter Title"
                            className="w-full px-4 py-2 rounded-md bg-[#1A1A1A] text-white"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label htmlFor="subDescription" className="text-white block mb-2">Sub Description</label>
                        <textarea
                            id="subDescription"
                            placeholder="Enter Sub Description"
                            className="w-full px-4 py-2 rounded-md bg-[#1A1A1A] text-white"
                            rows={3}
                            value={formData.subDescription}
                            onChange={(e) => setFormData({ ...formData, subDescription: e.target.value })}
                        />
                    </div>

                    <div>
                        <label htmlFor="productDescription" className="text-white block mb-2">Product Description</label>
                        <Editor
                            licenseKey='gpl'
                            tinymceScriptSrc='/tinymce/tinymce.min.js'
                            init={{
                                promotion: false,
                                height: 400,
                                skin: "oxide-dark",
                                content_css: "dark",
                                plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'],
                                toolbar: 'undo redo | blocks | ' + 'bold italic forecolor | alignleft aligncenter ' + 'alignright alignjustify | bullist numlist outdent indent | ' + 'removeformat | help | embed',
                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                verify_html: false,
                            }}
                            value={formData.description}
                            onEditorChange={(content) => setFormData({ ...formData, description: content })}
                            onInit={(evt, editor) => editorRef.current = editor}
                        />
                    </div>
                    {/* Dynamic Attributes */}
                    {/* <div>
                        <h2>Attributes</h2>
                        {attributes.map((attribute, index) => (
                            <div key={index} className="mb-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        placeholder="Attribute Name "
                                        value={attribute.name}
                                        onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                                        className=" px-4 py-2 rounded-md bg-[#1A1A1A] text-white"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Value"
                                        value={attribute.value}
                                        onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                                        className="px-4 py-2 rounded-md bg-[#1A1A1A] text-white"
                                    />
                                    <button onClick={() => removeAttribute(index)} className="text-red-500 px-2">-</button>
                                </div>
                            </div>
                        ))}
                        <button onClick={addAttribute} className="bg-blue-600 text-white px-4 py-2 rounded-md">+ Add Attribute</button>
                    </div> */}

                    {/* Variants */}
                    {/* <div>
                        <h2>Variants</h2>
                        {variants.map((variant, index) => (
                            <div key={index}>
                                <div className="flex gap-4 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Variant ID"
                                        value={variant.variantId}
                                        onChange={(e) => handleVariantChange(index, 'variantId', e.target.value)}
                                        className="w-1/2 px-4 py-2 rounded-md bg-[#1A1A1A] text-white"
                                    />
                                    <input
                                        type="text"
                                        placeholder="SKU"
                                        value={variant.sku}
                                        onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                                        className="w-1/2 px-4 py-2 rounded-md bg-[#1A1A1A] text-white"
                                    />
                                </div>

                                <div className="flex gap-4 mb-4">
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        value={variant.price || ""}
                                        onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                        className="w-1/2 px-4 py-2 rounded-md bg-[#1A1A1A] text-white"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Discount Price"
                                        value={variant.discountedPrice || ""}

                                        onChange={(e) => handleVariantChange(index, 'discountedPrice', e.target.value)}
                                        className="w-1/2 px-4 py-2 rounded-md bg-[#1A1A1A] text-white"
                                    />
                                </div>

                                <div className="flex gap-4 mb-4">
                                    <input
                                        type="number"
                                        placeholder="Quantity"
                                        value={variant.quantity || ""}

                                        onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
                                        className="w-1/2 px-4 py-2 rounded-md bg-[#1A1A1A] text-white"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Size"
                                        value={variant.size}
                                        onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                                        className="w-1/2 px-4 py-2 rounded-md bg-[#1A1A1A] text-white"
                                    />
                                </div>


                                <div className="flex gap-6 mb-6">

                                    <div className="flex flex-col items-center w-1/2">
                                        <label className="block text-white mb-2">Select Color</label>
                                        <input
                                            type="color"
                                            value={variant.color}
                                            onChange={(e) => {
                                                const hexColor = e.target.value;
                                                if (/^#[0-9A-F]{6}$/i.test(hexColor)) {
                                                    handleVariantChange(index, 'color', hexColor);
                                                } else {
                                                    console.error("Invalid hex color");
                                                }
                                            }}
                                            className="w-full px-4 py-2 rounded-md bg-[#1A1A1A] text-white focus:outline-none cursor-pointer"
                                        />

                                        <div
                                            className="mt-2 w-12 h-12 border rounded"
                                            style={{ backgroundColor: variant.color }}
                                        />
                                    </div>


                                    <div className="flex-1">
                                        <label className="block text-white mb-2">Variant Images</label>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => handleVariantImageChange(variant.variantId, e)}
                                            className="w-full px-4 py-2 rounded-md bg-[#1A1A1A] text-white focus:outline-none"
                                        />

                                        {variantImages[variant.variantId]?.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {variantImages[variant.variantId].map((image, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={URL.createObjectURL(image)}
                                                        alt={`Variant ${idx}`}
                                                        className="w-32 h-32 object-cover rounded-md shadow-lg"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
 <button onClick={() => removeVariant(index)} className="text-red-500 px-2">-</button>
                            </div>
                        ))}
                        <button onClick={addVariant} className="bg-blue-600 text-white px-2 py-1 rounded-md mt-4">+ Add Variant</button>
                    </div> */}

                </div>
                {/* Right side (Post status, visibility, category) */}
                <div className="w-full sm:w-[30%] flex flex-col space-y-4 border-2 border-solid border-gray-900 rounded-lg p-4">
                    <div>
                        <label htmlFor="productStatus" className="text-white">Product Status</label>
                        <select
                            id="productStatus"
                            className="px-4 py-2 rounded-md bg-[#1A1A1A] text-white w-full"
                            value={productStatus}
                            onChange={(e) => {
                                const newStatus = e.target.value;
                                setProductStatus(newStatus); // update the status
                                setFormData({ ...formData, status: newStatus }); // update formData status
                            }}
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="website" className="text-white">Website</label>
                        <select
                            id="website"
                            className="px-4 py-2 rounded-md bg-[#1A1A1A] text-white w-full"
                            value={formData.website}
                            onChange={(e) => {
                                setFormData({ ...formData, website: e.target.value }); // update formData status
                            }}
                            required
                        >
                            <option value="">--Select website--</option>
                            {
                                websiteArr.map((website: any, index: number) => (
                                    <option key={index} value={website.key}>{website.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    {/* {productStatus === "SCHEDULED" && (
                        <div>
                            <label htmlFor="publishDate" className="text-white block">Publish Date</label>
                            <DatePicker
                                selected={formData.publishDate}
                                onChange={(date: Date | null) => setFormData({ ...formData, publishDate: date })}
                                minDate={new Date()}
                                className="px-4 py-2 rounded-md bg-[#1A1A1A] text-white w-full"
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select a publish date"
                            />
                        </div>
                    )} */}
                    <div>
                        <label htmlFor="brand" className="text-white block mb-2">Brand</label>
                        <input
                            type="text"
                            id="brand"
                            placeholder="Enter Brand"
                            className="w-full px-4 py-2 rounded-md bg-[#1A1A1A] text-white"
                            value={formData.brand}
                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        />
                    </div>
                    {/* Category Selection */}
                    <div className="space-y-2">
                        <p>Category</p>
                        <input type="text" onChange={(e) => filterCategory(e.target.value)} className='w-full bg-gray-800 p-2 rounded-lg border-gray-950 outline-none' placeholder='Search...' />

                        <div className='h-[300px] flex flex-col overflow-y-auto'>
                            {filteredCategoryArr.map((category: any) => (
                                <div key={category._id} onClick={() => toggleCategory(category._id)} className="flex items-center justify-between cursor-pointer hover:bg-gray-800 rounded-lg p-2">
                                    <p>{category.name}</p>
                                    <div className={`w-4 h-4 border-[1px] border-gray-500 rounded-sm ${formData.category === category._id && "bg-blue-500"}`}>
                                        {formData.category === category._id && <Check className='w-full h-full object-cover' />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Product Button */}
            <div className="mt-4 flex justify-end">
                <button
                    onClick={handleEditProduct}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full sm:w-auto"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}
export default EditProduct;
