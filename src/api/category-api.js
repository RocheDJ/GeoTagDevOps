/* eslint-disable func-names */
import Boom from "@hapi/boom";
import {db} from "../models/db.js";
import {IdSpec, CategorySpec, CategorySpecPlus, CategoryArraySpec, PoiArraySpec} from "../models/joi-schemas.js";
import {validationError} from "./logger.js";

export const categoryApi = {
    find: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const categories = await db.categoryStore.getAllCategories();
                return categories;
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
        tags: ["api"],
        response: {schema: CategoryArraySpec, failAction: validationError},
        description: "Get all Categories for places of interest",
        notes: "Returns details of all categories ",
    },

    create: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const cat = await db.categoryStore.addCategory(request.payload);
                if (cat) {
                    return h.response(cat).code(201);
                }
                return Boom.badImplementation("error creating category");
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
        tags: ["api"],
        validate: {payload: CategorySpec},
        response: {schema: CategorySpecPlus, failAction: validationError},
        description: "Create a new Category",
        notes: "Add a new Category to the DB based on th input parameters",
    },

    deleteAll: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                await db.categoryStore.deleteAllCategories();
                return h.response().code(204);
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
        tags: ["api"],
        description: "Delete all catagories ",
        notes: "Delete all catagories for the Connected user or All if Admin",
    },

    deleteOne: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const cat = await db.categoryStore.getCategoryById(request.params.id);
                if (!cat) {
                    return Boom.notFound("No category with this id");
                }
                await db.categoryStore.deleteCategoryById(request.params.id);
                return h.response().code(204);
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
        tags: ["api"],
        validate: {params: {id: IdSpec}, failAction: validationError},
        description: "Delete a specific category ",
        notes: "Delete a specific category based on ID",
    },

    findOne: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const cat = await db.categoryStore.getCategoryById(request.params.id);
                if (!cat) {
                    return Boom.notFound("No category with this id");
                }
                return cat;
            } catch (err) {
                return Boom.serverUnavailable("No category with this id");
            }
        },
        tags: ["api"],
        validate: {params: {id: IdSpec}, failAction: validationError},
        response: {schema: CategorySpecPlus, failAction: validationError},
        description: "Find A Category",
        notes: "Find A Category Based on the input ID",
    },

    findPOIInCategory: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const cat = await db.categoryStore.getCategoryById(request.params.id);
                if (!cat) {
                    return Boom.notFound("No category with this id");
                }
                const pOIs = await db.categoryStore.getPOIByCategoryId(request.params.id);
                if (!pOIs) {
                    return Boom.notFound("No Points of interest in this category");
                }
                return pOIs;
            } catch (err) {
                return Boom.serverUnavailable("No category with this id");
            }
        },
        tags: ["api"],
        validate: {params: {id: IdSpec}, failAction: validationError},
        description: "Find POI in Specific Category",
        notes: "Get all the Points of interest Based on the category ID",
    },

}
