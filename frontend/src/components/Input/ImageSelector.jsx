import React from 'react';
import { useState, useRef,useEffect } from "react";
import { FaRegFileImage } from 'react-icons/fa6';
import { MdDeleteOutline } from 'react-icons/md';

const ImageSelector = ({ image, setImage, handleDeleteImg }) => {

    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        console.log(file);
        console.log(file);
        if (file) {
            setImage(file);
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setPreviewUrl(fileReader.result); // Set the preview URL
            };
            fileReader.readAsDataURL(file);
        }
    };

    const handleRemoveChange=()=>{
        setImage(null);
        handleDeleteImg();
    }

    const onChooseFile = () => {
        inputRef.current.click();
    };

    useEffect(()=>{
        if(typeof image === 'string'){
            setPreviewUrl(image);
        }else if(image){
            setPreviewUrl(URL.createObjectURL(image));
        }else{
            setPreviewUrl(null);
        }

        return ()=>{
            if(previewUrl && typeof previewUrl==="string" && !image){
                URL.revokeObjectURL(previewUrl);
            }
        }
    },[image]);

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageChange}
                className='hidden'
            />
            {!image ? (
                <button className="w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 roundd border border-slate-200/50"
                    onClick={() => onChooseFile()}>
                    <div className="w-14 h-14 flex items-center justify-center bg-teal-50 rounded-full border border-teal-100">
                        <FaRegFileImage className='text-xl text-teal-500' />
                    </div>

                    <p className="text-sm text-slate-500"> Upload</p>
                </button>
            ) : (
                <div className="w-85 items-center justify-center flex relative">
                    <img src={previewUrl} alt="Selected" className="h-[250px] object-cover rounded-lg" />

                    <button className="btn-small btn-delete absolute top-2"
                    onClick={handleRemoveChange}
                    >
                        <MdDeleteOutline className='text-lg'/>
                    </button>
                </div>
            )
            }
        </div>
    )
}

export default ImageSelector