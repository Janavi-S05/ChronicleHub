const Blog = require('../models/blogModel');
const path = require("path");
const fs = require("fs");
const postBlog = async (req, res) => {
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;
    if (!Array.isArray(visitedLocation) || visitedLocation.length === 0) {
        return res.status(400).json({ error: true, message: "Visited location must be a non-empty array" });
    }

    if (!title || !story || !visitedLocation || !visitedDate) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }
    const parsedVisitedDate = new Date(visitedDate);
    console.log("Parsed Visited Date (Backend):", parsedVisitedDate);

    try {
        const blog = new Blog({
            title,
            story,
            visitedLocation,
            userId,
            imageUrl,
            visitedDate: parsedVisitedDate,
        });
        await blog.save();
        console.log("Backend blog data", blog);
        res.status(201).json({ story: blog, message: "Added successfully" });
    } catch (err) {
        res.status(400).json({ error: true, message: err.message });
    }
}
const getAllBlog = async (req, res) => {
    const { userId } = req.user;
    try {
        const blogs = await Blog.find({ userId: userId }).sort({ isFavourite: -1 });
        res.status(200).json({ stories: blogs });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
}

const editBlog = async (req, res) => {
    const { id } = req.params;
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;
    //console.log("User id: ", userId);
    console.log("Image: ", imageUrl);
    //console.log("Date: ", visitedDate);
    if (!title || !story || !visitedLocation || !visitedDate) {
        return res.status(400).json({ error: true, message: "All fields are mandatory" });
    }
    //  visitedDate from millisec to date object
    const parsedVisitedDate = new Date(visitedDate);

    try {
        const blog = await Blog.findOne({ _id: id, userId: userId }); // find the blog by id and ensure it belongs to authenticated user

        if (!blog) {
            return res.status(404).json({ error: true, message: "Blog not found" });
        }
        
        const placeholderImgUrl = "http://localhost:8000/assets/techBrew.png";
        blog.title = title;
        blog.story = story;
        blog.visitedLocation = visitedLocation;
        blog.imageUrl = imageUrl || placeholderImgUrl;
        blog.visitedDate = parsedVisitedDate;
        console.log("Backend Image: ", blog.imageUrl);
        await blog.save();
        res.status(200).json({ story: blog, message: "update successful" });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
}

const deleteBlog = async (req, res) => {
    const { id } = req.params; // blog id
    const { userId } = req.user;

    try {
        const blog = await Blog.findOne({ _id: id, userId: userId });

        if (!blog) {
            return res.status(404).json({ error: true, message: "Blog not found" });
        }

        await blog.deleteOne({ _id: id, userId: userId }); // del blog from db

        // // extract filename from the imageUrl
        // const imageUrl = blog.imageUrl;
        // console.log(imageUrl);
        // const filename = path.basename(imageUrl);
        // console.log(filename);
        // const filePath = path.join(__dirname, 'uploads', filename);
        // console.log(filePath);
        // // del the image file from the uploads folder
        // fs.unlinkSync(filePath, (err) => {
        //     if (err) {
        //         console.log("failed to delete image file", err);
        //     }
        // })
        const imageUrl = blog.imageUrl;
        if (imageUrl) {
            const filename = path.basename(imageUrl);
            const filePath = path.join(__dirname, 'uploads', filename);

            try {
                // Delete the image file
                fs.unlinkSync(filePath);
                console.log("Image file deleted:", filePath);
            } catch (fileError) {
                console.error("Failed to delete image file:", fileError.message);
                // Optionally log this error or handle it as needed
            }
        }
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
}

const updateIsFavourite = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    const { isFavourite } = req.body;

    try {
        const blog = await Blog.findOne({ _id: id, userId: userId });
        if (!blog) {
            return res.status(404).json({ error: true, message: "Blog not found" });
        }

        blog.isFavourite = isFavourite;

        await blog.save();
        res.status(200).json({ story: blog, message: "Updated successfully" });

    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
}

const search = async (req, res) => {
    const { query } = req.query;
    // console.log(query);
    const { userId } = req.user;
    // console.log(userId);
    console.log(req);
    console.log(res);
    if (!query) {
        return res.status(404).json({ error: true, message: "query is required" });
    }

    try {
        const search = await Blog.find({
            userId: userId,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { story: { $regex: query, $options: 'i' } },
                { visitedLocation: { $regex: query, $options: 'i' } },
            ],
        }).sort({ isFavourite: -1 });
        res.status(200).json({ stories: search });

    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
}


const filter = async (req, res) => {
    const { startDate, endDate } = req.query;
    const { userId } = req.user;

    try {
        const start = new Date(parseInt(startDate));
        const end = new Date(parseInt(endDate));

        const filteredBlog = await Blog.find({
            userId: userId,
            visitedDate: { $gte: start, $lte: end },
        }).sort({ isFavourite: -1 });
        res.status(200).json({ stories: filteredBlog });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
}
module.exports = { postBlog, getAllBlog, editBlog, deleteBlog, updateIsFavourite, search, filter };