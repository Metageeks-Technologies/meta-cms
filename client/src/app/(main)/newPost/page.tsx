'use client';

import { useRef, useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import DatePicker from 'react-datepicker'; // Import react-datepicker
import 'react-datepicker/dist/react-datepicker.css'; // Import the CSS for styling the calendar
import { useAuth } from '@/hooks/useAuth';

interface FormData {
  postTitle: string;
  postDescription: string;
  postStatus: string;
  visibility: string;
  category: string[];
  tags: string[];
  publishDate: Date | null;
  previewImg: File | null;
}


const categories = [
  {
    name:"abc 1",
    selected: false 
  },
  {
    name:"abc 2",
    selected: false 
  },
  {
    name:"abc 3",
    selected: false 
  },
  {
    name:"abc 4",
    selected: false 
  },
  {
    name:"abc 5",
    selected: false 
  },
  {
    name:"abc 6",
    selected: false 
  },
  {
    name:"abc 7",
    selected: false 
  },
  {
    name:"abc 8",
    selected: false 
  },
  {
    name:"abc 9",
    selected: false 
  },
  {
    name:"abc 10",
    selected: false 
  },
]

const App: React.FC = () => {

  useAuth();

  const editorRef = useRef<any>(null);


  const [categoryArr, setCategoryArr] = useState(categories);

  const [formData, setFormData] = useState<FormData>({
    postTitle: "",
    postDescription: '',
    postStatus: '',
    visibility: '',
    category: [],
    tags: [],
    publishDate: null,
    previewImg: null,
  });


  const handleCategoryChange = (name: string) => {
      // const tempArr = categoryArr.map((category) => category.name === name ? category.selected = true : )
      // setCategoryArr()
  };

  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputTags = event.target.value.split(',').map(tag => tag.trim());
    setFormData({ ...formData, tags: inputTags });
  };

  const handlePublishDateChange = (date: Date | null) => {
    // Ensure the selected date is not in the past
    const currentDate = new Date();
    if (date && date >= currentDate) {
      setFormData({ ...formData, publishDate: date }); // Set the date if it's valid
    } else {
      alert('The publish date cannot be in the past!');
    }
  };

  const handlePublish = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      // Log or handle the data (title, description, status, content, publish date)

    }
  };




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
              <option value="scheduled">Scheduled</option>
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

          {/* Visibility */}
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
          </div>

          {/* Category Selection */}
          <div>
            <label htmlFor="visibility" className="text-white block">Category</label>
            <div className='styledScrollable bg-[#1a1a1a] max-h-80 overflow-y-auto rounded-lg p-2 sm:p-4'>
              {
                categoryArr.map((category, index) => (
                  <div key={index} onClick={() => handleCategoryChange(category.name)} className='p-2 cursor-pointer hover:bg-[#494949] rounded-lg flex items-center justify-between'>
                    <p>{category.name}</p>
                    <div className='w-4 h-4 border-[1px] border-gray-500 rounded-sm'>

                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handlePublish}
              className="bg-[#007bff] text-white px-6 py-2 rounded-md hover:bg-[#0056b3] w-full sm:w-auto"
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
