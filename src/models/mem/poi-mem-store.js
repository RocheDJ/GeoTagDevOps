import { v4 } from "uuid";

let aPoi = [];

export const poiMemStore = {
  async getAllPOI() {
    return aPoi;
  },

  async addPOI(CategoryId, poi) {
    poi._id = v4();
    poi.categoryid = CategoryId;
    aPoi.push(poi);
    return poi;
  },

  async getPOIByCategoryId(id) {
    let p = aPoi.filter((poi) => poi.categoryid === id);
    if (p === undefined) p = null;
    return p;
  },

  async getPOIById(id) {
    let p =  aPoi.find((poi) => poi._id === id);
    if (p === undefined) p = null;
    return p
  },

  async getCategoryPOI(CategoryId) {
    let p = aPoi.filter((poi) => poi.categoryid === CategoryId);
    if (p === undefined) p = null;
    return p
  },

  async deletePOIById(id) {
    const index = aPoi.findIndex((poi) => poi._id === id);
    // eslint-disable-next-line eqeqeq
    if (index != -1) aPoi.splice(index, 1);
    
  },

  async deleteAllPOI() {
    aPoi = [];
  },

  async updatePOI(poi, updatedPOI) {
    poi.name = updatedPOI.name;
    poi.description = updatedPOI.description;
    poi.latitude = updatedPOI.latitude;
    poi.longitude = updatedPOI.longitude;
  },
};
