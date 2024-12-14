require('dotenv').config();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
// const Blog = require('../models/blogModel');
const bcrypt = require("bcryptjs");
const { authenticateToken } = require('../utilities');

const register = async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400)
            .json({ error: true, message: "All fields are required" });
    }
    const isUser = await User.findOne({ email });
    if (isUser) {
        return res.status(400)
            .json({ error: true, message: "User already exists" });
    }
    const hashedPassword= await bcrypt.hash(password,10);

    const user=new User({
        fullName,
        email,
        password: hashedPassword,
    });

    await user.save();

    const accessToken = jwt.sign(
        { userId:user._id},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"72h"}
    );

    return res.status(201).json({
        error:false,
        user:{fullName: user.fullName, email: user.email},
        accessToken,
        message:"Registration successful",
    });
}

const login=async(req,res)=>{
    const {email,password} =req.body;
    if(!email ||!password)
    {
        return res.status(400).json({message:"Email and password are required"});
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message:"User not found"});
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(400).json({message:"Invalid credentials"});
    }

    const accessToken= jwt.sign(
        {
            userId: user._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:"72h",
        }
    );

    return res.json({
        error:false,
        message:"Login successful",
        user:{fullName:user.fullName,email:user.email},
        accessToken,
    });
}

const getUser= async(req,res)=>{
    const {userId} = req.user;
    const isUser= await User.findOne({_id: userId});

    if(!isUser)
    {
        return res.sendStatus(401);
    }
    return res.json({
        user:isUser,
        message: "",
    });
}

// const postBlog=async(req,res)=>{
//     const {title,story,visitedLocation,imageUrl,visitedDate} =req.body;
//     const {userId} = req.user;

//     if(!title||!story||!visitedLocation||!imageUrl||!visitedDate)
//     {
//         return res.status(400).json({error:true,message:"All fields are required"});
//     }

//     const parsedVisitedDate= new Date(parseInt(visitedDate));

//     try{
//         const blog= new Blog({
//             title,
//             story,
//             visitedLocation,
//             userId,
//             imageUrl,
//             visitedDate: parsedVisitedDate,
//         });
//         await blog.save();
//         res.status(201).json({story: blog, message: "Added successfully"});
//     }catch(err){
//         res.status(400).json({error:true,message: err.message});
//     }
// }
// const getAllBlog = async(req,res)=>{
//     const {userId}=req.user;
//     try{
//         const blogs= await Blog.find({userId: userId}).sort({isFavourite:-1});
//         res.status(200).json({stories: blogs});
//     }catch(error){
//         res.status(500).json({error:true,message: error.message});
//     }
// }
// const postImage = async(req,res)=>{
//     try{
//         if(!req.file){
//             return res.status(400).json({error:true,message:"No image uploaded"});
//         }

//         const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
//         // res.status(201).json({imageUrl});
//         res.status(200).json({
//             message: "File uploaded successfully",
//             filePath: imageUrl, // Public URL for the file
//             filename: req.file.filename,
//         });
//     }catch(error){
//         res.status(500).json({error:true,message:error.message});
//     }
// }

module.exports = {register,login,getUser};