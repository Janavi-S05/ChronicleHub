const express= require("express");
const router = express.Router();

const { deleteImage, postImage } = require("../controllers/imageController");
const upload = require("../multer");

router.route("/imageUpload").post(upload.single("image"),postImage);
router.route("/deleteImage").delete(deleteImage);

module.exports = router;