'use client';

import { useRef, useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import DatePicker from 'react-datepicker'; // Import react-datepicker
import 'react-datepicker/dist/react-datepicker.css'; // Import the CSS for styling the calendar
import { useAuth } from '@/hooks/useAuth';
import { NewPostFormData } from '@/types';
import { categories } from '@/constant/post';
import axiosCall from '@/utils/ApiCall';
import { TiTick } from "react-icons/ti";
import toast from 'react-hot-toast';


const App: React.FC = () => {

  useAuth();

  const editorRef = useRef<any>(null);


  const [loading, setLoading] = useState(false);
  const [categoryArr, setCategoryArr] = useState([]);


  const [formData, setFormData] = useState<NewPostFormData>({
    postTitle: "",
    postDescription: '',
    postStatus: 'draft',
    category: [],
    tags: [],
    publishDate: null,
    previewImg: null,
  });

  const fetchCategory = async () => {
    try {
      const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/categories`);

      if (resp.status === 200 || resp.status === 201) {
        setCategoryArr(resp.data);
        // console.log(resp);
      } else {
        toast.error(resp.data.message, {
          duration: 2000,
        });
      }
      
    } catch (error) {
      console.log(error);
    }
  }

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

  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputTags = event.target.value.split(',').map(tag => tag.trim());
    setFormData({ ...formData, tags: inputTags });
  };

  const handlePublishDateChange = (date: Date | null) => {
    const currentDate = new Date();
    if (date && date >= currentDate) {
      setFormData({ ...formData, publishDate: date });
    } else {
      alert('The publish date cannot be in the past!');
    }
  };



  const handleCreatePost = async () => {
    if (!formData.postTitle.trim()) {
      toast.error('Post title is required.', {
        duration: 2000
      });
      return;
    }
    if (!formData.postDescription.trim()) {
      toast.error('Post description is required.', {
        duration: 2000
      });
      return;
    }

    if (!Array.isArray(formData.category) || formData.category.length === 0) {
      toast.error('At least one category must be selected.', {
        duration: 2000
      });
      return;
    }
    if (!Array.isArray(formData.tags) || formData.tags.length === 0) {
      toast.error('Add atleast one tag', {
        duration: 2000
      });
      return;
    }
    if (!formData.publishDate) {
      toast.error('Please select published date', {
        duration: 2000
      });
      return;
    }

    // if (formData.previewImg && !(formData.previewImg instanceof File)) {
    //   toast.error('Preview image must be a valid file.', {
    //     duration: 2000
    //   });
    //   return;
    // }

    try {

      // const form = new FormData();

      // form.append('title', formData.postTitle);
      // form.append('description', formData.postDescription);
      // form.append('previewImageKey', 'uploads/images/post-preview.jpg');
      // formData.tags.forEach(tag => {
      //   form.append('tags', tag);
      // });
      // formData.category.forEach(category => {
      //   form.append("categories", category)
      // });
      // form.append('status', formData.postStatus);
      // form.append('publishedDate', formData.publishDate?.toISOString());

      setLoading(true);

      const payload = {
        title: formData.postTitle,
        description: formData.postDescription,
        previewImageKey: 'uploads/images/post-preview.jpg',
        tags: formData.tags,
        categories: formData.category,
        status: formData.postStatus,
        publishedDate: formData.publishDate,
      }


      const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/posts`, payload);
      // console.log(resp, "Response");

      if (resp.status === 200 || resp.status === 201) {
        toast.success(resp.data.message, {
          duration: 2000
        });

        setFormData({
          postTitle: "",
          postDescription: '',
          postStatus: 'draft',
          category: [],
          tags: [],
          publishDate: null,
          previewImg: null,
        });
        editorRef.current?.setContent('');
        fetchCategory();
        setLoading(false);

      }else{
        toast.success(resp.data.message, {
          duration: 2000
        });
        setLoading(false);
      }

    } catch (error) {
      setLoading(false);
      console.log(error);
    }

  };

  useEffect(() => {
    fetchCategory();
  }, []);


  return (
    <div className='border-1 border-dashed border-gray-900 p-4'>
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
              className="w-full px-4 py-2 rounded-md bg-[#1a1a1a] text-white"
            />

          </div>

          <div>
            <label htmlFor="postTitle" className="text-white block mb-2">Preview image</label>
            <input
              type="file"
              id=""
              onChange={(e: any) => setFormData({ ...formData, previewImg: e.target.files[0] })}
              placeholder="Enter post title"
              className="w-full px-4 py-2 rounded-md bg-[#1a1a1a] text-white"
            />
          </div>

          {/* Post Description (TinyMCE Editor) */}
          <div>
            <label htmlFor="postDescription" className="text-white block mb-2">Post Description</label>
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
              init={{
                height: 400,
                skin: "oxide-dark",
                content_css: "dark",
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount',
                ],
                external_plugins: {
                  // Provide the api route set above
                  embed: "/api/embed?requestType=plugin",
                },
                toolbar: 'undo redo | bold italic forecolor | bullist numlist | removeformat | embed',
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
            <label htmlFor="tags" className="text-white block mb-2">Tags</label>
            <input
              type="text"
              id="tags"
              value={formData.tags.join(', ')}
              onChange={handleTagChange}
              placeholder="Enter tags separated by commas"
              className="w-full px-4 py-2 rounded-md bg-[#1a1a1a] text-white"
            />
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
              className="px-4 py-2 rounded-md bg-[#1a1a1a] text-white w-full"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Publish Date */}
          <div>
            <label htmlFor="publishDate" className="text-white block">Publish Date</label>
            <DatePicker
              selected={formData.publishDate}
              onChange={handlePublishDateChange}
              minDate={new Date()} // Prevent selecting past dates
              className="px-4 py-2 rounded-md bg-[#1a1a1a] text-white w-full"
              dateFormat="yyyy-MM-dd"
              placeholderText="Select a publish date"
            />
          </div>

          {/* Visibility
          <div>
            <label htmlFor="visibility" className="text-white block">Visibility</label>
            <select
              id="visibility"
              value={formData.visibility}
              onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
              className="px-4 py-2 rounded-md bg-[#1a1a1a] text-white w-full"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div> */}

          {/* Category Selection */}
          <div>
            <label htmlFor="visibility" className="text-white block">Category</label>
            <div className='styledScrollable bg-[#1a1a1a] max-h-80 overflow-y-auto rounded-lg p-2 sm:p-4'>
              {
                categoryArr.map((category: any, index) => (
                  <div key={index} onClick={() => toggleCategory(category._id)} className='p-2 cursor-pointer hover:bg-[#494949] rounded-lg flex items-center justify-between'>
                    <p>{category.name}</p>
                    <div className={`w-4 h-4 border-[1px] border-gray-500 rounded-sm flex items-center justify-center  ${formData.category.includes(category._id) && "bg-blue-500"}`}>
                      {
                        formData.category.includes(category._id) &&
                        <TiTick />
                      }
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleCreatePost}
              disabled={loading ? true : false}
              className={`bg-[#007bff] text-white px-6 py-2 rounded-md hover:bg-[#0056b3] w-full sm:w-auto`}
            >
              {
                loading ? (
                  "Loading..."
                ) : (
                  'Create Post'
                )
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
