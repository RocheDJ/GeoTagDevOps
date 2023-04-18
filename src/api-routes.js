import { userApi } from "./api/user-api.js";
import { categoryApi } from "./api/category-api.js";
import { poiApi } from "./api/poi-api.js";

export const apiRoutes = [
  // USERS API Routes 
  { method: "GET", path: "/api/users", config: userApi.find },
  { method: "POST", path: "/api/users", config: userApi.create },
  { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
  { method: "GET", path: "/api/users/{id}", config: userApi.findOne },
  // CATEGORY API Routes 
  { method: "GET", path: "/api/category", config: categoryApi.find },
  { method: "DELETE", path: "/api/category",config: categoryApi.deleteAll},
  { method: "DELETE", path: "/api/category/{id}",config: categoryApi.deleteOne},
  { method: "POST", path: "/api/category",config: categoryApi.create},
  { method: "GET", path: "/api/category/{id}", config: categoryApi.findOne },
  { method: "GET", path: "/api/category/{id}/poi",config: categoryApi.findPOIInCategory},
  // Place Of interest API Routes 
  { method: "GET", path: "/api/poi", config: poiApi.find },
  { method: "DELETE", path: "/api/poi",config: poiApi.deleteAll},
  { method: "DELETE", path: "/api/poi/{id}",config: poiApi.deleteOne},
  { method: "POST", path: "/api/category/{id}/poi",config: poiApi.create},
  { method: "POST", path: "/api/category/{id}/poid",config: poiApi.createDemo},

  { method: "GET", path: "/api/poi/{id}", config: poiApi.findOne },

// Authenticate route
  { method: "POST", path: "/api/users/authenticate", config: userApi.authenticate },

];
