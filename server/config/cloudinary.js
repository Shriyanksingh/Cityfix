const cloudinary = require('cloudinary').v2;
// 1. No curly braces here
const CloudinaryStorage = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// 2. NO "new" keyword here! Just call it directly as a function.
const storage = CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cityfix_issues',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

module.exports = { cloudinary, storage };