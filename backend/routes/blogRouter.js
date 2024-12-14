const express= require("express");
const router = express.Router();
const { authenticateToken } = require('../utilities');
const { postBlog, getAllBlog, editBlog, deleteBlog, updateIsFavourite, search, filter } = require("../controllers/blogController");

router.route("/blog").post(authenticateToken,postBlog);
router.route("/allBlog").get(authenticateToken,getAllBlog);
router.route("/editBlog/:id").put(authenticateToken, editBlog);
router.route("/deleteBlog/:id").delete(authenticateToken, deleteBlog);
router.route("/updateFav/:id").put(authenticateToken,updateIsFavourite);
router.route("/search").get(authenticateToken,search);
router.route("/filter").get(authenticateToken,filter);
module.exports= router;