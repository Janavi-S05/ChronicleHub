import React, { useState } from 'react'
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from 'react-icons/md'
import DateSelector from '../../components/Input/DateSelector'
import ImageSelector from '../../components/Input/ImageSelector';
import TagInput from '../../components/Input/TagInput';
import { toast } from 'react-toastify';
import uploadImage from '../../utils/uploadImage';
import axiosInstance from '../../utils/axiosInstance';
import moment from 'moment';
import { formatISO } from 'date-fns';
const AddEditBlog = ({
    blogInfo,
    type,
    onClose,
    getAllBlogs
}) => {

    const [title, setTitle] = useState(blogInfo?.title || "");
    const [blogImg, setBlogImg] = useState(blogInfo?.imageUrl || null);
    console.log("Edit Blog Image URL: ", blogInfo?.imageUrl);
    const [story, setStory] = useState(blogInfo?.story || "");
    const [visitedLocation, setVisitedLocation] = useState(blogInfo?.visitedLocation || []);
    const [visitedDate, setVisitedDate] = useState(blogInfo?.visitedDate || null);
    const [error, setError] = useState("")

    const addBlog = async () => {
        try {
            let imageUrl = "";
            if (blogImg) {
                const imgUpload = await uploadImage(blogImg);
                console.log("Uploaded Image Response:", imgUpload);

                // Use the filePath from the image upload response
                imageUrl = imgUpload.filePath || ""; // Ensure this is the correct path
                if (!imageUrl) {
                    toast.error("Image upload failed. Please try again.");
                    return;
                }
            }

            console.log("Before Visited Date:", visitedDate);
            const formattedVisitedDate = visitedDate
                ? moment(visitedDate).toISOString() // Converts to UTC format
                : new Date().toISOString();
                

            console.log("Formatted Visited Date (JavaScript):", formattedVisitedDate);
            const res = await axiosInstance.post("/blog", {
                title,
                story,
                imageUrl: imageUrl || "",
                visitedLocation,
                visitedDate: formattedVisitedDate,
            });

            console.log("Resultant data:", res);
            if (res.data && res.data.story) {
                toast.success("Blog added");
                getAllBlogs();
                onClose();
            }
        } catch (error) {
            if (error.res && error.res.data && error.res.data.message) {
                setError(error.res.data.message);
            } else {
                setError("An unexpected error occurred. Please try again");
            }
        }
    }


    const updateBlog = async () => {

        const blogId = blogInfo._id;
        try {
            let imageUrl = "";
            console.log("Blog modified image: ", blogImg);
            // console.log("Before Visited Date:", visitedDate);
            const formattedVisitedDate = visitedDate
                ? moment(visitedDate).toISOString() // Converts to UTC format
                : new Date().toISOString();
            // console.log("Formatted Visited Date (JavaScript):", formattedVisitedDate);

            console.log("Image in the frontend: ", blogInfo.imageUrl);
            console.log("BlogImg: ", blogInfo.imageUrl);
            let editData = {
                title,
                story,
                imageUrl: blogImg || "",
                visitedLocation,
                visitedDate: formattedVisitedDate,
            }
            console.log("update: ",editData.imageUrl);
            if (blogImg && typeof blogImg === "object") {
                const imgUploadRes = await uploadImage(blogImg);
                imageUrl = imgUploadRes.filePath || "";

                editData = {
                    ...editData,
                    imageUrl: imageUrl,
                }
            }
            console.log("Editted data: ", editData);
            const res = await axiosInstance.put("/editBlog/" + blogId, editData);
            console.log("Resultant data:", res);
            if (res.data && res.data.story) {
                toast.success("Blog updated");
                getAllBlogs();
                onClose();
            }
        } catch (error) {
            if (error.res && error.res.data && error.res.data.message) {
                setError(error.res.data.message);
            } else {
                setError("An unexpected error occurred. Please try again");
            }
        }
    }

    const handleAddUpdateClick = async () => {
        console.log("Data ", { title, blogImg, story, visitedLocation, visitedDate });
        if (!title) {
            setError("Enter the title");
            return;
        }
        if (!story) {
            setError("Enter the story");
            return;
        }
        if (visitedLocation.length === 0) {
            setError("Enter at least one visited location");
            return;
        }
        console.log("Visited Date before sending:", visitedDate);
        if (!visitedDate) {
            setError("Select a valid visited date");
            return;
        }
        setError("");

        if (type == "edit") {
            updateBlog();
        } else {
            addBlog();
        }
    }

    const handleDeleteImg = async () => {
        // Delete the image
        const deleteImgRes = await axiosInstance.delete("/deleteImage", {
            params: {
                imageUrl: blogInfo.imageUrl,
            },
        });

        if (deleteImgRes.data) {
            const blogId = blogInfo._id;
            console.log("Blog: ",blogInfo);
            const putData = {
                title,
                story,
                visitedLocation,
                visitedDate: new Date(blogInfo.visitedDate),
                imageUrl: ""
            }

            console.log("Add the info date: ",putData);
            // updating blog
            const res = await axiosInstance.put(
                "/editBlog/" + blogId, putData);
            console.log("After deleting and update: ",res);
            setBlogImg(null);
        }
    }

    return (
        <div className='relative'>
            <div className="flex items-center justify-between">
                <h5 className="text-xl font-medium text-slate-700">
                    {type === "add" ? "Add Blog" : "Edit Blog"}
                </h5>
                <div>
                    <div className="flex items-center gap-3 bg-teal-50/50 p-2 rounded-l-lg">
                        {type === "add" ? (
                            <button className='btn-small' onClick={handleAddUpdateClick}>
                                <MdAdd className='text-lg' /> ADD BLOG
                            </button>
                        ) : (
                            <>
                                <button className='btn-small' onClick={updateBlog}>
                                    <MdUpdate className='text-lg' /> EDIT BLOG
                                </button>
                            </>
                        )}

                        <button className='btn-small' onClick={onClose}>
                            <MdClose className='text-xl text-slate-400 hover:text-white' />
                        </button>
                    </div>

                    {
                        error && (
                            <p className="text-red-500 text-xs pt-2 text-right">{error}</p>
                        )
                    }
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-2 pt-4">
                <label className="input-label">TITLE</label>
                <input type="text"
                    className="text-2xl text-slate-950 outline-none"
                    placeholder="Blooming tech Stacks"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div className="my-3">
                    <DateSelector date={visitedDate} setDate={setVisitedDate} />
                </div>

                <ImageSelector image={blogImg} setImage={setBlogImg} handleDeleteImg={handleDeleteImg} />
                <div className="flex flex-col gap-2 mt-4">
                    <label className="input-label">BLOG</label>
                    <textarea
                        type="text"
                        className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
                        placeholder='Your Blog'
                        rows={10}
                        value={story}
                        onChange={(e) => setStory(e.target.value)}
                    />
                </div>
                <div className="pt-3">
                    <label className="input-label">VISITED LOCATIONS</label>
                    <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
                </div>
            </div>
        </div>
    )
}

export default AddEditBlog