import { v4 } from "uuid";
import os from "os";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import {POI} from "../mongo/poi.js";



const connection = await mysql.createConnection({
    host : process.env.mysql_host, // "localhost",
    user :  process.env.mysql_user,// "geotag",
    password: process.env.mysql_password, // "geotag",
    database: process.env.mysql_db
});

export const poiMySQLStore = {
    async getAllPOI() {
        await connection.connect();
        const query = "SELECT * FROM pois";
        const [poi] = await connection.query(query);
        return poi;
    },

    async addPOI(categoryId, poi) {

        const poiData = {
            _id : v4(),
            name: poi.name,
            description: poi.description,
            latitude: poi.latitude,
            longitude: poi.longitude,
            image   : poi.image,
            categoryID : categoryId
        };

        await connection.connect();
        const query = "INSERT INTO pois (_id,name, description,latitude,longitude,image,categoryID,server_id) VALUES (?, ?, ?,? ,?, ?,?,?)";
        try{
            const ServerID = os.hostname();
            const [result] = await connection.query(query, [poiData._id,poiData.name, poiData.description,poiData.latitude,
                poiData.longitude,poiData.image,poiData.categoryID,ServerID.toString]);
        }catch (e) {
             console.log(`Add POI Error = ${  e.description}` );
        }

        return poiData;
    },

    async getPOIByCategoryId(id) {
        const query = "SELECT * FROM pois WHERE categoryID = ?";
        await connection.connect();
        let [data] = await connection.query(query, [id]);
        if (data === undefined) data = null;
        return data;
    },

    async getPOIById(id) {
        if (id) {
            const query = "SELECT * FROM pois WHERE _ID = ?";
            await connection.connect();
            const [data] = await connection.query(query, [id]);
            let poi = data[0];
            if (poi === undefined) poi = null;
            return poi;
        }
        return null;
    },

    async deletePOIById(id) {
        try {
            const query = "DELETE FROM pois WHERE _id = ?";
            await connection.query(query, [id]);
        } catch (error) {
            console.log(`Delete Poi By ID Error = ${  error.description}` );
        }
    },

    async deleteAllPOI() {
        await connection.connect();
        const query = "DELETE FROM pois";
        await connection.query(query);
    },

    async updatePOI(poi, updatedPOI) {
        poi.name = updatedPOI.name;
        poi.description = updatedPOI.description;
        poi.latitude = updatedPOI.latitude;
        poi.longitude = updatedPOI.longitude;
        poi.categoryID = updatedPOI.categoryID;
        poi.imageFileName = updatedPOI.imageFileName;
        await poi.save();
    },
};