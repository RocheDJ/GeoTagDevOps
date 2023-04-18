import { v4 } from "uuid";
import { poiMemStore } from "./poi-mem-store.js";

let aCategories = [];

export const categoryMemStore = {
  async getAllCategories() {
    return aCategories;
  },

  async addCategory(category) {
    category._id = v4();
    aCategories.push(category);
    return category;
  },

  async getCategoryById(id) {
    const list = aCategories.find((category) => category._id === id);
    if (list) {
      return list;
    }
    return null;
  },
 
  async getCategoryPOIById(id) {
    const list = aCategories.find((category) => category._id === id);
    if (list) {
      list.poi = await poiMemStore.getPOIByCategoryId(list._id);
      return list;
    }
    return null;
  },

  async getUserCategories(userid) {
    return aCategories.filter((category) => category.userid === userid);
  },

  async deleteCategoryById(id) {
    
    const index = aCategories.findIndex((category) => category._id === id);
    if (index !== -1) aCategories.splice(index, 1);
  },

  async deleteAllCategories() {
    aCategories = [];
  },
};
