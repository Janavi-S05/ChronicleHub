const express= require("express");
const router = express.Router();
const {register,login,getUser,postBlog, getAllBlog,postImage}= require("../controllers/userController");
const { authenticateToken } = require('../utilities');
// const upload = require("../multer");
// const { deleteImage } = require("../controllers/deleteController");
// const fs=require("fs");
// const path=require("path");

router.route("/signup").post(register);
router.route("/login").post(login);
router.route("/user").get(authenticateToken,getUser);
// router.route("/blog").post(authenticateToken,postBlog);
// router.route("/allBlog").get(authenticateToken,getAllBlog);
// router.route("/imageUpload").post(upload.single("image"),postImage);
// router.route("/deleteImage").delete(deleteImage);
module.exports = router;