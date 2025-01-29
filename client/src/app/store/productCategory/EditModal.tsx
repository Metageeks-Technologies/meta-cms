import React from 'react';

interface Category {
    name: string;
    imageUrl: string;
    description: string;
    code: string;
}

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEdit: (category: Category) => void;
    categoryToEdit: Category;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onEdit, categoryToEdit }) => {
    const [name, setName] = React.useState(categoryToEdit.name);
    const [imageUrl, setImageUrl] = React.useState(categoryToEdit.imageUrl);
    const [description, setDescription] = React.useState(categoryToEdit.description);
    const [code, setCode] = React.useState(categoryToEdit.code);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        onEdit({ name, imageUrl, description, code });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-zinc-800 rounded p-4">
                <h2 className="text-lg font-bold">Edit Category</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="editCategoryName">Category Name</label>
                        <input 
                            type='text'
                            id="editCategoryName"
                            placeholder="Name"
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 p-2 mb-2 bg-zinc-800 rounded-lg" 
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="editImageUrl">Image URL</label>
                        <input 
                            placeholder="Image URL"
                            type='file'
                            id="editImageUrl"
                            value={imageUrl} 
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full border border-gray-300 p-2 mb-2 bg-zinc-800 rounded-lg" 
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="editCategoryDescription">Category Description</label>
                        <textarea 
                            id="editCategoryDescription"
                            placeholder="Description" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-300 p-2 mb-2 bg-zinc-800 rounded-lg" 
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="editCategoryCode">Category Code</label>
                        <input 
                            placeholder="Code" 
                            id="editCategoryCode"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full border border-gray-300 p-2 mb-2 bg-zinc-800 rounded-lg" 
                            required
                        />
                    </div> 
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save Changes</button>
                    <button type="button" onClick={onClose} className="ml-2 bg-red-500 px-4 py-2 rounded">Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default EditModal;
