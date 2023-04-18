import { v4 } from "uuid";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const db = new Low(new JSONFile("./src/models/json/poi.json"));
db.data = { poi: [] };

export const poiJsonStore = {
  async getAllPOI() {
    await db.read();
    return db.data.poi;
  },

  async addPOI(CategoryId, poi) {
    await db.read();
    poi._id = v4();
    poi.categoryid = CategoryId;
    db.data.poi.push(poi);
    await db.write();
    return poi;
  },

  async getPOIByCategoryId(id) {
    await db.read();
    let p = db.data.poi.filter((poi) => poi.categoryid === id);
    if (p === undefined) p = null;
    return p;
  },

  async getPOIById(id) {
    await db.read();
    let p =  db.data.poi.find((poi) => poi._id === id);
    if (p === undefined) p = null;
    return p;
  },

  async deletePOIById(id) {
    await db.read();
    const index = db.data.poi.findIndex((poi) => poi._id === id);
    // eslint-disable-next-line eqeqeq
    if (index != -1)  db.data.poi.splice(index, 1);
    await db.write();
  },

  async deleteAllPOI() {
    db.data.poi = [];
    await db.write();
  },

  async updatePoi(poi, updatedPOI) {
    poi.name = updatedPOI.name;
    poi.description = updatedPOI.description;
    poi.latitude = updatedPOI.latitude;
    poi.longitude = updatedPOI.longitude;
    await db.write();
  },
};
