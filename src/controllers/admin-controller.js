import {db} from "../models/db.js";

export const adminController = {
    index: {
        handler: async function (request, h) {
            const users = await db.userStore.getAllUsers();
            const viewData = {
                title: "Geo Track Administrator",
                users: users,
            };
            return h.view("admin-view", viewData);
        },
    },
    deleteUser: {
        handler: async function (request, h) {
            await db.userStore.deleteUserById(request.params.id);
            return h.redirect("/admin");
        },
    },

    suspendUser: {
        handler: async function (request, h) {
            await db.userStore.suspendUserById(request.params.id);
            return h.redirect("/admin");
        },
    },

    makeUserAdmin: {
        handler: async function (request, h) {
            await db.userStore.userIsAdminById(request.params.id);
            return h.redirect("/admin");
        },
    },

    makeUserNonAdmin: {
        handler: async function (request, h) {
            await db.userStore.userIsNormalById(request.params.id);
            return h.redirect("/admin");
        },
    },
};
