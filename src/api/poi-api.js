/* eslint-disable func-names */
import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, PoiSpec, PoiSpecPlus, PoiArraySpec } from "../models/joi-schemas.js";
import {validationError} from "./logger.js";

export const poiApi = {
    find: {
        auth: {
            strategy: "jwt",
        },
      handler: async function (request, h) {
        try {
          const poi = await db.poiStore.getAllPOI();
          return poi;
        } catch (err) {
          return Boom.serverUnavailable("Database Error");
        }
      },
        tags: ["api"],
        response: { schema: PoiArraySpec, failAction: validationError },
        description: "Get all places of interest",
        notes: "Returns details of all places of interest ",
    },

    create: {
        auth: {
            strategy: "jwt",
        },
      handler: async function (request, h) {
        try {
          const poi = await db.poiStore.addPOI(request.params.id,request.payload);
          if (poi) {
            return h.response(poi).code(201);
          }
          return Boom.badImplementation("error creating poi");
        } catch (err) {
          return Boom.serverUnavailable("Database Error");
        }
      },
      tags: ["api"],
      description: "Create a new POI",
      notes: "Add a new POI to the DB based on th input parameters",
      validate: { payload: PoiSpec},  // on the incoming we want to match this schema i.e. PoiSpec
      response: { schema: PoiSpecPlus, failAction: validationError },
    },
    
    deleteAll: {
        auth: {
            strategy: "jwt",
        },
      handler: async function (request, h) {
        try {
          await db.poiStore.deleteAllPOI();
          return h.response().code(204);
        } catch (err) {
          return Boom.serverUnavailable("Database Error");
        }
      },
      tags: ["api"],
      description: "Delete all places of interest ",
      notes: "Delete all places of interest for the Connected user or All if Admin",
    },

    deleteOne: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const poi = await db.poiStore.getPOIById(request.params.id);
                if (!poi) {
                    return Boom.notFound("No poi with this id");
                }
                await db.poiStore.deletePOIById(request.params.id);
                return h.response().code(204);
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
      tags: ["api"],
      description: "Delete a specific POI ",
      validate: { params: { id: IdSpec }, failAction: validationError },
      notes: "Delete a specific POI based on ID",
    },
    
    findOne: {
        auth: {
            strategy: "jwt",
        },
      handler: async function (request, h) {
        try {
          const poi = await db.poiStore.getPOIById(request.params.id);
          if (!poi) {
            return Boom.notFound("No poi with this id");
          }
          return poi;
        } catch (err) {
          return Boom.serverUnavailable("No poi with this id");
        }
      },
      tags: ["api"],
      description: "Find A POI info from ID",
      validate: { params: { id: IdSpec }, failAction: validationError },
      response: { schema: PoiSpecPlus, failAction: validationError },
      notes: "Find a POI Based on the input ID",
    },

    createDemo: {
        auth: false,
        handler: async function (request, h) {
            try {
                const poi = await db.poiStore.addPOI(request.params.id,request.payload);
                if (poi) {
                    return h.response(poi).code(201);
                }
                return Boom.badImplementation("error creating poi");
            } catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
        tags: ["api"],
        description: "Create a new Demo POI No Auth needed",
        notes: "Add a new POI to the DB based on th input parameters",
        validate: { payload: PoiSpec},  // on the incoming we want to match this schema i.e. PoiSpec
    },

}
