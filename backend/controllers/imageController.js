const path= require("path");
const fs=require("fs");

const postImage = async(req,res)=>{
    try{
        if(!req.file){
            return res.status(400).json({error:true,message:"No image uploaded"});
        }
        const filePath = path.join(__dirname, "../uploads", req.file.filename);

        const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
        console.log("File uploaded to:", filePath); // Log the correct path
        // const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
        // console.log(filePath);
        // res.status(201).json({imageUrl});
        res.status(200).json({
            message: "File uploaded successfully",
            filePath: imageUrl, // Public URL for the file
            filename: req.file.filename,
        });
    }catch(error){
        res.status(500).json({error:true,message:error.message});
    }
}

const deleteImage = async(req,res)=>{
    const {imageUrl} = req.query;
    if(!imageUrl){
        return res.status(400).json({error: true, message:"imageUrl parameter is required"});
    }
    try{
        //fetch filename from the imageUrl
        const filename= path.basename(imageUrl);
        // define file path
        const filePath = path.join(__dirname, "../uploads", filename);
        console.log("file path", filePath);
        console.log("filename", filename);
        // check if the file exists
        if(fs.existsSync(filePath)){
            // delete the file from the uploads folder
            fs.unlinkSync(filePath);
            res.status(200).json({error: true, message: "Image deleted successfully"});
        } else{
            res.status(200).json({error: true,message: "Image not found"});
        }
    }catch(error){
        res.status(500).json({error: true, message: error.message});
    }
}

module.exports={deleteImage,postImage};