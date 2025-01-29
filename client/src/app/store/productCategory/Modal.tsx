import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (category: { name: string; imageUrl: string; description: string; code: string }) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onCreate }) => {
    const [name, setName] = React.useState('');
    const [imageUrl, setImageUrl] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [code, setCode] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        onCreate({ name, imageUrl, description, code });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-2xl">
            <div className="bg-zinc-800 rounded p-4">
                <h2 className="text-lg font-bold mb-5">Add Category</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="categoryName">Category Name</label>
                        <input 
                            type='text'
                            id="categoryName"
                            placeholder="Name"
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 p-2 mb-2 bg-zinc-800 rounded-lg" 
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="imageUrl">Image URL</label>
                        <input 
                            placeholder="Image URL"
                            type='file' 
                            id="imageUrl"
                            value={imageUrl} 
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full border border-gray-300 p-2 mb-2 bg-zinc-800 rounded-lg" 
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="categoryDescription">Category Description</label>
                        <textarea 
                            id="categoryDescription"
                            placeholder="Description" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-300 p-2 mb-2 bg-zinc-800 rounded-lg" 
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="categoryCode">Category Code</label>
                        <input 
                            placeholder="Code" 
                            id="categoryCode"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full border border-gray-300 p-2 mb-2 bg-zinc-800 rounded-lg" 
                            required
                        />
                    </div> 
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create</button>
                    <button type="button" onClick={onClose} className="ml-2 bg-red-500 px-4 py-2 rounded">Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default Modal;
