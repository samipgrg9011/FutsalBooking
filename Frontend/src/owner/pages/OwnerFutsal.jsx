
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';

const OwnerFutsal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newFutsal, setNewFutsal] = useState({
        name: '',
        pricePerHour: '',
        description: '',
        images: [], // New images to upload (File objects)
        existingImages: [], // Existing image URLs from the server
        deletedImages: [], // Images marked for deletion
        location: ''
    });

    const [futsals, setFutsals] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editFutsal, setEditFutsal] = useState(null);

    const fetchFutsals = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/futsals/owner", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (response.status === 200) {
                setFutsals(response.data.futsals);
            }
        } catch (error) {
            console.error(error); // Log the error to inspect it


        }
    };

    useEffect(() => {
        fetchFutsals();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFutsal((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setNewFutsal((prev) => ({
            ...prev,
            images: [...prev.images, ...selectedFiles]
        }));
    };

    const removeNewImage = (index) => {
        setNewFutsal((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const removeExistingImage = (imageUrl) => {
        setNewFutsal((prev) => ({
            ...prev,
            existingImages: prev.existingImages.filter((img) => img !== imageUrl),
            deletedImages: [...prev.deletedImages, imageUrl]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const totalImages = newFutsal.existingImages.length + newFutsal.images.length;
        if (totalImages < 5) {
            toast.error("Please ensure at least 5 images remain.");
            return;
        }

        const formData = new FormData();
        formData.append('name', newFutsal.name);
        formData.append('pricePerHour', newFutsal.pricePerHour);
        formData.append('description', newFutsal.description);
        formData.append('location', newFutsal.location);
        newFutsal.images.forEach((image) => formData.append('images', image));
        formData.append('deletedImages', JSON.stringify(newFutsal.deletedImages)); // Send deleted image URLs

        try {
            let response;
            if (isEditing && editFutsal) {
                response = await axios.put(`http://localhost:8000/api/owner/futsal/${editFutsal._id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
            } else {
                response = await axios.post("http://localhost:8000/api/owner/futsal", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
            }

            if (response.status === 200 || response.status === 201) {
                toast.success(isEditing ? "Futsal updated successfully" : "Futsal added successfully");
                setIsModalOpen(false);
                setIsEditing(false);
                setEditFutsal(null);
                setNewFutsal({ name: '', pricePerHour: '', description: '', images: [], existingImages: [], deletedImages: [], location: '' });
                fetchFutsals();
            }
        } catch (err) {
            toast.error("There was an error while saving futsal.");
        }
    };

    const handleEditFutsal = (futsal) => {
        setIsEditing(true);
        setEditFutsal(futsal);
        setNewFutsal({
            name: futsal.name,
            pricePerHour: futsal.pricePerHour,
            description: futsal.description,
            images: [],
            existingImages: futsal.images,
            deletedImages: [],
            location: futsal.location
        });
        setIsModalOpen(true);
    };

    const handleDeleteFutsal = async (futsal) => {
        if (!window.confirm("Are you sure you want to delete this futsal?")) return;

        setFutsals((prevFutsals) => prevFutsals.filter(item => item._id !== futsal._id));
        try {
            const response = await axios.delete(`http://localhost:8000/api/owner/futsal/${futsal._id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (response.status === 200) {
                toast.success("Futsal deleted successfully");
            }
        } catch (error) {
            toast.error("Failed to delete futsal.");
            fetchFutsals();
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-10 px-6 min-h-screen">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b pb-3">Owner Futsal Management</h1>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Futsal List</h2>
                <button
                    className="bg-blue-700 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-600 transition-all"
                    onClick={() => {
                        setNewFutsal({ name: '', pricePerHour: '', description: '', images: [], existingImages: [], deletedImages: [], location: '' });
                        setIsEditing(false);
                        setEditFutsal(null);
                        setIsModalOpen(true);
                    }}
                >
                    <AiOutlinePlus className="inline-block mr-2" /> Add Futsal
                </button>
            </div>

            <ToastContainer />

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full border-collapse">
                    <thead className="bg-blue-100 text-gray-800">
                        <tr className="text-left">
                            <th className="px-6 py-4 w-1/4 border-b">Name</th>
                            <th className="px-6 py-4 w-1/4 border-b">Price</th>
                            <th className="px-6 py-4 w-1/4 border-b">Location</th>
                            <th className="px-6 py-4 w-1/4 border-b">Images</th>
                            <th className="px-6 py-4 w-1/4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {futsals.length > 0 ? (
                            futsals.map(futsal => (
                                <tr key={futsal._id} className="hover:bg-gray-100 transition">
                                    <td className="px-6 py-4 border-b">{futsal.name}</td>
                                    <td className="px-6 py-4 border-b">Rs{futsal.pricePerHour}</td>
                                    <td className="px-6 py-4 border-b">{futsal.location}</td>
                                    <td className="px-6 py-4 border-b">
                                        {futsal.images.length > 0 && (
                                            <img
                                                src={`http://localhost:8000/${futsal.images[0]}`}
                                                alt="futsal"
                                                className="h-14 w-14 object-cover rounded"
                                            />
                                        )}
                                    </td>
                                    <td className="px-6 py-4 border-b">
                                        <div className="flex space-x-5">
                                            <button className="text-blue-600 hover:underline" onClick={() => handleEditFutsal(futsal)}>Edit</button>
                                            <button className="text-red-600 hover:underline" onClick={() => handleDeleteFutsal(futsal)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="px-6 py-4 text-center text-gray-500" colSpan={5}>No futsals available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl font-semibold mb-4">{isEditing ? "Edit Futsal" : "Add New Futsal"}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Name</label>
                                <input type="text" name="name" value={newFutsal.name} onChange={handleInputChange} className="border w-full p-2 rounded" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Price</label>
                                <input type="number" name="pricePerHour" value={newFutsal.pricePerHour || ''} onChange={handleInputChange} className="border w-full p-2 rounded" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Location</label>
                                <input type="text" name="location" value={newFutsal.location} onChange={handleInputChange} className="border w-full p-2 rounded" required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Images (Minimum 5)</label>
                                {/* Upload Box */}
                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4">
                                    <input
                                        type="file"
                                        multiple
                                        name="images"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="hidden"
                                        id="imageUpload"
                                    />
                                    <label
                                        htmlFor="imageUpload"
                                        className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-500 transition"
                                    >
                                        Upload Images
                                    </label>
                                    {/* <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p> */}
                                    <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>

                                </div>

                                {/* Existing Images */}
                                {newFutsal.existingImages.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600">Existing Images:</p>
                                        {newFutsal.existingImages.map((imageUrl, index) => (
                                            <div key={index} className="inline-block mr-2 relative">
                                                <img
                                                    src={`http://localhost:8000/${imageUrl}`}
                                                    alt={`existing-futsal-${index}`}
                                                    className="h-14 w-14 object-cover rounded"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center"
                                                    onClick={() => removeExistingImage(imageUrl)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* New Images */}
                                {newFutsal.images.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600">New Images:</p>
                                        {newFutsal.images.map((file, index) => (
                                            <div key={index} className="inline-block mr-2 relative">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`new-futsal-${index}`}
                                                    className="h-14 w-14 object-cover rounded"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center"
                                                    onClick={() => removeNewImage(index)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Description</label>
                                <textarea name="description" value={newFutsal.description} onChange={handleInputChange} className="border w-full p-2 rounded"></textarea>
                            </div>
                            <div className="flex justify-between">
                                <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">{isEditing ? "Edit Futsal" : "Add Futsal"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerFutsal;