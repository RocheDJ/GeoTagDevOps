import { v4 } from "uuid";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { poiMySQLStore } from "./poi-mysql-store.js";

const res = dotenv.config();

const connection = await mysql.createConnection({
    host : process.env.mysql_host, // "localhost",
    user :  process.env.mysql_user,// "geotag",
    password: process.env.mysql_password, // "geotag",
    database: process.env.mysql_db
});

export const categoryMySQLStore = {
    async getAllCategories() {
        await connection.connect();
        const query = "SELECT * FROM categories";
        const [aCategories] = await connection.query(query);
        return aCategories;
    },

    async addCategory(category) {
        const categoryData = {
            _id : v4(),
            title: category.title,
            img: category.img,
            userid: category.userid
        };
        await connection.connect();
        const query = "INSERT INTO categories (_id, title, img, userid) VALUES (?, ?, ?, ? )";
        try{
            const [result] = await connection.query(query, [categoryData._id,categoryData.title, categoryData.img,categoryData.userid]);
        }  catch (error) {
            console.log(error.description)
        }
        return categoryData;
    },

    async getCategoryById(id) {
        const query = "SELECT * FROM categories WHERE _id = ?";
        await connection.connect();
        const [data] = await connection.query(query, [id]);

        if (data) {
            // get poi for that category
            const poiData = await  poiMySQLStore.getPOIByCategoryId(data[0]._id)
            data[0].poi = poiData;
            return data[0];
        }
        return null;
    },

    async getUserCategories(userid) {
        const query = "SELECT * FROM categories WHERE userid = ?";
        await connection.connect();
        const [data] = await connection.query(query, [userid]);

        if (data) {
            return data;
        }
        return null;
    },

    async deleteCategoryById(id) {
        const query = "DELETE FROM categories WHERE _id = ?";
        await connection.query(query, [id]);
    },

    async deleteAllCategories() {
        await connection.connect();

        const query = "DELETE FROM categories";

        await connection.query(query);
    },
};