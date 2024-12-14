const multer= require("multer");
const path= require("path");

//Storage config
const storage= multer.diskStorage({
    destination: function(req,file,cb){
        const uploadPath = path.join(__dirname, "uploads");
        cb(null,uploadPath); //destination folder for storing uploaded files
    },
    filename: function(req,file,cb){
        cb(null,Date.now()+path.extname(file.originalname)); //upload filename
    },
});

// File filter to accept only images
const fileFilter = (req,file,cb)=>{
    console.log("File received:", file);
    if(file.mimetype.startsWith("image/")){
        cb(null,true);
    }else{
        cb(new Error(`Invalid file type: ${file.mimetype}`),false);
    }
};

const upload = multer({storage,fileFilter});
module.exports= upload;