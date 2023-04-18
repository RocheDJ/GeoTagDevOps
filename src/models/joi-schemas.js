import Joi from "joi";

export const schUserType = Joi.object().keys({
    type: Joi.string().valid("normal", "admin", "group", "suspended"),
});

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserTypeSpec = Joi.alternatives().try(Joi.string(), schUserType).description("a valid User Group"); // can be a string or a user type object
// ################ User Spec #############################
export const UserCredentialsSpec = Joi.object()
    .keys({
        email: Joi.string().email().example("homer@simpson.com").required(),
        password: Joi.string().example("secret").required(),
    })
    .label("UserCredentials");

export const UserSpec = UserCredentialsSpec.keys({
    firstName: Joi.string().example("Homer").required(),
    lastName: Joi.string().example("Simpson").required(),
    userType: UserTypeSpec,
}).label("UserDetails");

export const UserSpecPlus = UserSpec.keys({
    _id: IdSpec,
    __v: Joi.number(),
}).label("UserDetailsPlus");

export const UserArray = Joi.array().items(UserSpecPlus).label("UserArray");


// ################ Place of interest Spec #############################
export const PoiSpec = Joi.object()
    .keys({
        name: Joi.string().example("Somewhere beach").required(),
        description: Joi.string().example("Description of Somewhere beach").optional(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        imageFileName: Joi.any().optional(),
        categoryID: IdSpec,
    })
    .label("POI");

export const PoiSpecPlus = PoiSpec.keys({
    _id: IdSpec,
    __v: Joi.number(),
}).label("PoiPlus");

export const PoiArraySpec = Joi.array().items(PoiSpecPlus).label("PoiArray");

// ################ Category Spec         #############################
export const CategorySpec = Joi.object()
    .keys({
        title: Joi.string().required().example("Beaches"),
        poi: PoiArraySpec,
        userID: IdSpec,
    })
    .label("Category");

export const CategorySpecPlus = CategorySpec.keys({
    _id: IdSpec,
    __v: Joi.number(),
})
    .label("CategoryPlus");

export const CategoryArraySpec = Joi.array().items(CategorySpecPlus).label("CategoryArray");

export const JwtAuth = Joi.object()
    .keys({
        success: Joi.boolean().example("true").required(),
        token: Joi.string().example("eyJhbGciOiJND.g5YmJisIjoiaGYwNTNjAOhE.gCWGmY5-YigQw0DCBo").required(),
    })
    .label("JwtAuth");
