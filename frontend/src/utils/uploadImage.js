import React from 'react'
import axiosInstance from './axiosInstance';

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image',imageFile);

  try{
    const res = await axiosInstance.post("/imageUpload",formData,{
        headers:{
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
  }catch(error){
    console.error('Error uploading image: ',error);
    throw error;
  }
}

export default uploadImage;