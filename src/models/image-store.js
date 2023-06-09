import * as cloudinary from "cloudinary";
import { writeFileSync } from "fs";
import dotenv from "dotenv";

dotenv.config();

const credentials = {
    cloud_name: process.env.cloudinary_name,
    api_key: process.env.cloudinary_key,
    api_secret: process.env.cloudinary_secret
};
cloudinary.config(credentials);

const defaultImage =  process.env.default_image;

export const imageStore = {

    getAllImages: async function() {
        const result = await cloudinary.v2.api.resources();
        return result.resources;
    },

    uploadImage: async function(imagefile) {
        let retURL = defaultImage;
        try {
            writeFileSync("./public/temp.img", imagefile);
            const response = await cloudinary.v2.uploader.upload("./public/temp.img");
            retURL = response.url;
        }catch(ex){
            console.log(`uploadImage Error =${  ex.message}`);
        }
        return retURL;
    },

    deleteImage: async function(img) {
        await cloudinary.v2.uploader.destroy(img, {});
    }
};