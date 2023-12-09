import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINDARY_NAME,
  api_key: process.env.CLOUDINDARY_KEY,
  api_secret: process.env.CLOUDINDARY_SECRET,
});

export default cloudinary;