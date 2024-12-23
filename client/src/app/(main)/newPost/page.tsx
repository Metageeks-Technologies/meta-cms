'use client';

import { useRef, useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import DatePicker from 'react-datepicker'; // Import react-datepicker
import 'react-datepicker/dist/react-datepicker.css'; // Import the CSS for styling the calendar

const App: React.FC = () => {
  const editorRef = useRef<any>(null); // Type the editorRef as any since TinyMCE's editor can be dynamic
  const [isClient, setIsClient] = useState<boolean>(false); // Track client-side rendering
  const [postTitle, setPostTitle] = useState<string>(''); // State to hold the post title
  const [postDescription, setPostDescription] = useState<string>(''); // State to hold the post description
  const [postStatus, setPostStatus] = useState<string>('draft'); // State to hold the post status (draft, published, scheduled)
  const [visibility, setVisibility] = useState<string>('public'); // State to hold the visibility (public, private)
  const [category, setCategory] = useState<string>('crypto'); // State to hold the selected category
  const [tags, setTags] = useState<string[]>([]); // State to hold the tags array
  const [publishDate, setPublishDate] = useState<Date | null>(null); // State for the publish date

  // UseEffect to ensure the component only renders on the client side
  useEffect(() => {
    setIsClient(true); // Set isClient to true after the component mounts
  }, []);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPostTitle(event.target.value);
  };

  const handleDescriptionChange = (content: string) => {
    setPostDescription(content); // Update the post description when content changes
  };

  const handlePostStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPostStatus(event.target.value); // Update post status when selected
  };

  const handleVisibilityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setVisibility(event.target.value); // Update visibility when selected
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(event.target.value); // Update category when selected
  };

  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputTags = event.target.value.split(',').map(tag => tag.trim());
    setTags(inputTags); // Update the tags array when input changes
  };

  const handlePublishDateChange = (date: Date | null) => {
    // Ensure the selected date is not in the past
    const currentDate = new Date();
    if (date && date >= currentDate) {
      setPublishDate(date); // Set the date if it's valid
    } else {
      alert('The publish date cannot be in the past!');
    }
  };

  const handlePublish = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      // Log or handle the data (title, description, status, content, publish date)
      console.log('Post Title:', postTitle);
      console.log('Post Description:', postDescription);
      console.log('Post Status:', postStatus);
      console.log('Visibility:', visibility);
      console.log('Category:', category);
      console.log('Tags:', tags.join(', '));
      console.log('Publish Date:', publishDate);
      console.log('Post Content:', content);
    }
  };

  if (!isClient) {
    return null; // Prevent rendering the TinyMCE editor on the server
  }

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
              value={postTitle}
              onChange={handleTitleChange}
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
                  'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | bold italic forecolor | bullist numlist | removeformat',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                verify_html: false,
              }}
              value={postDescription}
              onEditorChange={handleDescriptionChange}
              onInit={(evt, editor) => editorRef.current = editor}
            />
          </div>

          {/* Tags Input */}
          <div>
            <label htmlFor="tags" className="text-white block mb-2">Tags</label>
            <input
              type="text"
              id="tags"
              value={tags.join(', ')}
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
              value={postStatus}
              onChange={handlePostStatusChange}
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
              selected={publishDate}
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
              value={visibility}
              onChange={handleVisibilityChange}
              className="px-4 py-2 rounded-md bg-[#1a1a1a] text-white w-full"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          {/* Category Selection */}
          <div>
            <label htmlFor="category" className="text-white block">Category</label>
            <select
              id="category"
              value={category}
              onChange={handleCategoryChange}
              className="px-4 py-2 rounded-md bg-[#1a1a1a] text-white w-full"
            >
              <option value="crypto">Crypto</option>
              <option value="entertainment">Entertainment</option>
              <option value="technology">Technology</option>
              <option value="finance">Finance</option>
            </select>
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
