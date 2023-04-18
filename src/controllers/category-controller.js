import {PoiSpec} from "../models/joi-schemas.js";
import {db} from "../models/db.js";
import {imageStore} from "../models/image-store.js";

export const categoryController = {
    index: {
        handler: async function (request, h) {
            const category = await db.categoryStore.getCategoryById(request.params.id);
            const viewData = {
                title: "Category",
                category: category,
                poi: category.poi,
            };
            return h.view("category-view", viewData);
        },
    },
    addPoi: {
        validate: {
            payload: PoiSpec,
            options: {abortEarly: false},
            failAction: function (request, h, error) {
                return h.view("category-view", {title: "Add POI error", errors: error.details}).takeover().code(400);
            },
        },
        handler: async function (request, h) {
            const category = await db.categoryStore.getCategoryById(request.params.id);
            const file = request.payload.imageFileName;
            let url =""
            if (Object.keys(file).length > 0) {
                url = await imageStore.uploadImage(request.payload.imageFileName);
            }

            const newPoi = {
                name: request.payload.name,
                latitude: Number(request.payload.latitude),
                longitude: Number(request.payload.longitude),
                image: url,
                description: "not used",
            };

            await db.poiStore.addPOI(category._id, newPoi);
            return h.redirect(`/category/${category._id}`);
        },
        payload: {
            multipart: true,
            output: "data",
            maxBytes: 209715200,
            parse: true,
        },
    },




    uploadImage: {
        handler: async function (request, h) {
            try {
                const category = await db.categoryStore.getCategoryById(request.params.id);
                const file = request.payload.imagefile;
                if (Object.keys(file).length > 0) {
                    const url = await imageStore.uploadImage(request.payload.imagefile);
                    category.img = url;
                    await db.categoryStore.updateCategory(category);
                }
                return h.redirect(`/category/${category._id}`);
            } catch (err) {
                console.log(err);
                return h.redirect(`/category/${category._id}`);
            }
        },
        payload: {
            multipart: true,
            output: "data",
            maxBytes: 209715200,
            parse: true,
        },
    },
    deletePoi: {
        handler: async function (request, h) {
            const category = await db.categoryStore.getCategoryById(request.params.id);
            await db.poiStore.deletePOIById(request.params.poiid);
            return h.redirect(`/category/${category._id}`);
        },
    },
};
