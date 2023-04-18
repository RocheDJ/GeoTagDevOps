import { v4 } from "uuid";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { poiJsonStore } from "./poi-json-store.js";

const db = new Low(new JSONFile("./src/models/json/categories.json"));
db.data = { categories: [] };

export const categoryJsonStore = {
  async getAllCategories() {
    await db.read();
    return db.data.categories;
  },

  async addCategory(category) {
    await db.read();
    category._id = v4();
    db.data.categories.push(category);
    await db.write();
    return category;
  },

  async getCategoryById(id) {
    await db.read();
    const list = db.data.categories.find((category) => category._id === id);
    if (list) {
      return list;
    }
    return null;
  },
  
  async getCategoryPOIById(id) {
    const list = db.data.categories.find((category) => category._id === id);
    if (list) {
      list.poi = await poiJsonStore.getPOIByCategoryId(list._id);
      return list;
    }
    return null;
  },

  async getUserCategories(userid) {
    await db.read();
    const list =  db.data.categories.filter((category) => category.userid === userid);
    if (list) {
    return list;
    }
    return null;
  },

  async deleteCategoryById(id) {
    await db.read();
    const index = db.data.categories.findIndex((category) => category._id === id);
    if (index !== -1) db.data.categories.splice(index, 1);
    await db.write();
  },

  async deleteAllCategories() {
    db.data.categories = [];
    await db.write();
  },
};
