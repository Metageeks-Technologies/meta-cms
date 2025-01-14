'use client';
import { useRef, useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { NewPostFormData } from '@/types';
import axiosCall from '@/utils/ApiCall';
import { TiTick } from "react-icons/ti";
import toast from 'react-hot-toast';
import { Check } from 'lucide-react';
import MediaModal from './component/mediaModal';
import { useUserContext } from '@/context/userContext';
import { getURL } from '@/utils/AWS_Config';
import { postStatuEnum } from '@/constant/post';

const App: React.FC = () => {
  const { setLoading, user } = useUserContext();

  const editorRef = useRef<any>(null);
  const [categoryArr, setCategoryArr] = useState([]);
  const [filteredCategoryArr, setFilteredCategoryArr] = useState(categoryArr);
  const [tagInput, setTagInput] = useState('');
  const [formData, setFormData] = useState<NewPostFormData>({
    postTitle: "",
    postDescription: '',
    postStatus: 'draft',
    slug: '',
    category: [],
    tags: [],
    publishDate: null,
    previewImg: '',
  });
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  // Fetch categories
  const fetchCategory = async () => {
    setLoading(true);
    try {
      const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/categories`);
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

  // Fetch categories on mount
  useEffect(() => {
    if(user.role) fetchCategory();
  }, [user]);

  // Handle image selection from MediaPage modal
  const handlePreviewImageChange = (imageKey: string) => {
    setFormData({ ...formData, previewImg: imageKey });
    setIsMediaModalOpen(false); // Close modal after selection
  };

  interface PayloadType {
    title: string;
    description: string;
    previewImageKey: string | File | null;
    slug: string;
    tags: string[];
    categories: string[];
    status: string;
    publishedDate?: Date;
  }

  // Handle post creation
  const handleCreatePost = async () => {
    if (!formData.postTitle.trim()) {
      toast.error('Post title is required.', { duration: 2000 });
      return;
    }

    if (!formData.postDescription.trim()) {
      toast.error('Post description is required.', { duration: 2000 });
      return;
    }

    if (!formData.slug.trim()) {
      toast.error('Post slug is required.', { duration: 2000 });
      return;
    }
    
    if (formData.slug.trim().length < 3) {
      toast.error('Add atleast 3 character in slug.', { duration: 2000 });
      return;
    }

    if (!Array.isArray(formData.category) || formData.category.length === 0) {
      toast.error('At least one category must be selected.', { duration: 2000 });
      return;
    }

    if (!Array.isArray(formData.tags) || formData.tags.length === 0) {
      toast.error('Add at least one tag', { duration: 2000 });
      return;
    }

    if (formData.postStatus === postStatuEnum.SCHEDULED && !formData.publishDate) {
      toast.error('Please select a Date', { duration: 2000 });
      return;
    }

    setLoading(true);
    try {
      const payload: PayloadType = {
        title: formData.postTitle,
        description: formData.postDescription,
        previewImageKey: formData.previewImg,
        slug: formData.slug,
        tags: formData.tags,
        categories: formData.category,
        status: formData.postStatus,
        ...(formData.publishDate && { publishedDate: formData.publishDate }),
      };

      const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/posts`, payload);

      if (resp.status === 200 || resp.status === 201) {
        toast.success(resp.data.message, { duration: 2000 });

        // Reset form data
        setFormData({
          postTitle: "",
          postDescription: '',
          postStatus: 'draft',
          slug: '',
          category: [],
          tags: [],
          publishDate: null,
          previewImg: '',
        });
        setTagInput('');
         editorRef.current?.setContent(''); // Reset TinyMCE editor content
        fetchCategory(); // Re-fetch categories
      } else {
        toast.error(resp.data.message, { duration: 2000 });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle category toggle
  const toggleCategory = (id: string) => {
    setFormData((prevData) => {
      const { category } = prevData;
      if (category.includes(id)) {
        return {
          ...prevData,
          category: category.filter((catId) => catId !== id),
        };
      } else {
        return {
          ...prevData,
          category: [...category, id],
        };
      }
    });
  };

  // Filter categories based on search query
  const filterCategory = (query: string) => {
    setFilteredCategoryArr(categoryArr.filter((category: any) =>
      category.name.toLowerCase().includes(query.toLowerCase())
    ));
  };

  // Handle tag input change
  const handleTagAdd = () => {
    if (!tagInput.trim().length) return;
    setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
    setTagInput('');
  };

  const removeTag = (tagName: string) => {
    const filteredTags = formData.tags.filter(tag => tag !== tagName);
    setFormData({ ...formData, tags: filteredTags });
  };

  const handleEditSlug = (value:string) => {
    if(value.length <= 128){
      setFormData({...formData, slug: value})
    }
  }


  return (
    <div className='border-1 border-dashed border-gray-900 p-4 relative'>
      <div className="bg-[#0A090F] border-[#414141] p-6 space-y-6 flex flex-col sm:flex-row gap-8 mx-auto">
        {/* Left side (Post title, description, and tags) */}
        <div className="w-full sm:w-[70%] flex flex-col space-y-9">
          {/* Post Title */}
          <div>
            <label htmlFor="postTitle" className="text-white block mb-2">Post Title</label>
            <input
              type="text"
              id="postTitle"
              value={formData.postTitle}
              onChange={(e) => setFormData({ ...formData, postTitle: e.target.value })}
              placeholder="Enter post title"
              className="w-full px-4 py-2 rounded-md bg-[#1A1A1A] text-white"
            />
          </div>
          {/* Preview image input */}
          <div>
            <label htmlFor="postTitle" className="text-white block mb-2">Preview image</label>
            <div
              onClick={() => setIsMediaModalOpen(true)}
              className="cursor-pointer w-full flex justify-center items-center p-4 bg-[#1A1A1A] rounded-md text-white border-collapse"
            >
              {formData.previewImg ? (
                <img
                  src={typeof formData.previewImg === 'string' ? getURL(formData.previewImg) : URL.createObjectURL(formData.previewImg)}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-md"
                />
              ) : (
                <span className="text-xl">+  Upload your preview Image</span> // Placeholder for no image selected
              )}

            </div>
          </div>
          {/* Post Description (TinyMCE Editor) */}
          <div>
            <label htmlFor="postDescription" className="text-white block mb-2">Post Description</label>
            <Editor
              // apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
              licenseKey='gpl'
              tinymceScriptSrc='/tinymce/tinymce.min.js'
              init={{
                promotion: false,
                height: 400,
                skin: "oxide-dark",
                content_css: "dark",
                external_plugins: {
                  embed: "/api/embed?requestType=plugin",
                },
                plugins: [
                  'advlist',
                  'autolink',
                  'lists',
                  'link',
                  'image',
                  'charmap',
                  'anchor',
                  'searchreplace',
                  'visualblocks',
                  'code',
                  'fullscreen',
                  'insertdatetime',
                  'media',
                  'table',
                  'preview',
                  'help',
                  'wordcount',
                ],
                toolbar:
                  'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help | embed',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                verify_html: false,
              }}
              value={formData.postDescription}
              onEditorChange={(content) => setFormData({ ...formData, postDescription: content })}
              onInit={(evt, editor) => editorRef.current = editor}
            />



          </div>
          {/* Tags Input */}

          <div>
            <div className='flex flex-row items-center flex-wrap gap-2'>
              {
                formData.tags.map((tag, index) => (
                  <p key={index} className='bg-gray-900 px-2 py-1 rounded-full'>
                    {tag}
                    <span className='bg-gray-800 rounded-full cursor-pointer px-2 py-1 ml-2' onClick={() => removeTag(tag)}>x</span>
                  </p>
                ))
              }
            </div>

            <label htmlFor="tags" className="text-white block my-2">Tags</label>
            <div className='flex flex-row items-center gap-2 px-4 py-2 rounded-md bg-[#1A1A1A] text-white'>
              <input
                type="text"
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Enter tag"
                className="w-full h-full outline-none border-none bg-transparent"
              />
              <button onClick={handleTagAdd} className='bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-md'>ADD</button>
            </div>
          </div>
        </div>

        {/* Right side (Post status, visibility, category, publish date) */}
        <div className="w-full sm:w-[30%] flex flex-col space-y-4 border-2 border-solid border-gray-900 rounded-lg p-4">
          {/* Post Status */}
          <div>
            <label htmlFor="postStatus" className="text-white">Post Status</label>
            <select
              id="postStatus"
              value={formData.postStatus}
              onChange={(e) => setFormData({ ...formData, postStatus: e.target.value })}
              className="px-4 py-2 rounded-md bg-[#1A1A1A] text-white w-full"
            >
              <option value={postStatuEnum.DRAFT}>Draft</option>
              <option value={postStatuEnum.PUBLISHED}>Published</option>
              <option value={postStatuEnum.SCHEDULED}>Scheduled</option>
            </select>
          </div>

          {/* Publish Date */}
          {
            formData.postStatus === postStatuEnum.SCHEDULED &&
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
          }


          {/* Slug */}
          <label className='w-full flex flex-col gap-2'>
            <span>Create Slug</span>
            <span className='text-xs italic text-gray-400 -mt-3'>(Contain only lowercase letters, numbers, hyphens, and underscores)</span>
            <input
              type="text"
              className='w-full bg-[#1A1A1A] px-4 py-2 rounded-lg outline-none border-none'
              placeholder='Enter slug'
              value={formData.slug}
              onChange={(e) => handleEditSlug(e.target.value)}
            />
          </label>

          {/* Category Selection */}
          <div className="space-y-2">
            <p>Category</p>
            <input type="text" onChange={(e) => filterCategory(e.target.value)} className='w-full bg-gray-800 p-2 rounded-lg border-gray-950 outline-none' placeholder='Search...' />

            <div className='h-[300px] flex flex-col overflow-y-auto'>
              {filteredCategoryArr.map((category: any) => (
                <div key={category._id} onClick={() => toggleCategory(category._id)} className="flex items-center justify-between cursor-pointer hover:bg-gray-800 rounded-lg p-2">
                  <p>{category.name}</p>
                  <div className={`w-4 h-4 border-[1px] border-gray-500 rounded-sm ${formData.category.includes(category._id) && "bg-blue-500"}`}>
                    {
                      formData.category.includes(category._id) &&
                      <Check className='w-full h-full object-cover' />
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <button
          className="px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          onClick={handleCreatePost}
        >
          Create Post
        </button>
      </div>


      {/* Media Modal */}
      {
        isMediaModalOpen && (
          <MediaModal
            onSelectImage={handlePreviewImageChange}
            setIsMediaModalOpen={setIsMediaModalOpen}
          />
        )
      }

    </div >
  );
};

export default App;
