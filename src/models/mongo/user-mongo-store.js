import Mongoose  from "mongoose";
import { User } from "./user.js";



export const userMongoStore = {
  async getAllUsers() {
    const users = await User.find().lean();
    return users;
  },

  async getUserById(id) {
    if (id) {
      if (Mongoose.Types.ObjectId.isValid(id)){
        const user = await User.findOne({ _id: id }).lean();
        return user;
      }
    }
    return null;
  },

  async addUser(user) {
    const newUser = new User(user);
    const userObj = await newUser.save();
    const u = await this.getUserById(userObj._id);
    return u;
  },

  async getUserByEmail(email) {
    const user = await User.findOne({ email: email }).lean();
    return user;
  },
  async suspendUserById(id) {
    try {
      if (Mongoose.Types.ObjectId.isValid(id)){
        const user = await User.findOne({ _id: id }).lean();
        if (user){
          user.userType="suspended";
          user.save();
        }else{
          console.log("suspendUserById Error : user not found");
        }

      }
    } catch (error) {
      console.log(`suspendUserById Error :${  error.message}`);
    }
  },

  async userIsAdminById(id) {
    try {
      if (Mongoose.Types.ObjectId.isValid(id)){
        const user = await User.findOne({ _id: id }).lean();
        if (user){
          await User.updateOne({ _id: id },{$set:{userType:"admin"}});
        }else{
          console.log("userIsAdminById Error : user not found");
        }

      }
    } catch (error) {
      console.log(`userIsAdminById Error :${  error.message}`);
    }
  },

  async userIsNormalById(id) {
    try {
      if (Mongoose.Types.ObjectId.isValid(id)){
        const user = await User.findOne({ _id: id }).lean();
        if (user){
         await User.updateOne({ _id: id },{$set:{userType:"normal"}});
        }else{
          console.log("userIsNormalById Error : user not found");
        }

      }
    } catch (error) {
      console.log(`userIsNormalById Error :${  error.message}`);
    }
  },
  async deleteUserById(id) {
    try {
      await User.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAll() {
    await User.deleteMany({});
  }
};
