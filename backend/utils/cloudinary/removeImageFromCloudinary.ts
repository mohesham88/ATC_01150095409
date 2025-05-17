import { v2 as cloudinary } from "cloudinary";

export const cloudinaryRemoveImage = async (imagePublicId) => {
  try {
    const result = await cloudinary.uploader.destroy(imagePublicId);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error (cloudinary)");
  }
};

export const cloudinaryRemoveMultipleImage = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error (cloudinary)");
  }
};
