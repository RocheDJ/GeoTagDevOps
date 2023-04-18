import { v4 } from "uuid";
import mysql from "mysql2/promise";
import dotenv from "dotenv";


const result = dotenv.config();

const connection = await mysql.createConnection({
  host : process.env.mysql_host, // "localhost",
  user :  process.env.mysql_user,// "geotag",
  password: process.env.mysql_password, // "geotag",
  database: process.env.mysql_db
});

export const userMySQLStore = {
  

  async getAllUsers() {
    await connection.connect();
    const query = "SELECT * FROM users";
    const [users] = await connection.query(query);
    return users;
  },

  async addUser(user) {
    const userData = {
      _id : v4(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      userType: user.userType
    };
    await connection.connect();
    const query = "INSERT INTO users (_id,firstName, lastName,email,password,userType) VALUES (?, ?, ?,? ,?, ?)";
    const [result] = await connection.query(query, [userData._id,userData.firstName, userData.lastName,userData.email,
      userData.password,userData.userType]);
    return userData;
  },

  async getUserById(id) {
    const query = "SELECT * FROM users WHERE _id = ?";
    await connection.connect();
    const [data] = await connection.query(query, [id]);
    let user = data[0]; // returns the last row in the array
    if (user === undefined) user = null;
    return user;
  },

  async getUserByEmail(email) {
    const query = "SELECT * FROM users WHERE email = ?";
    await connection.connect();
    const [data] = await connection.query(query, [email]);
    let user = data[0]; // returns the last row in the array
    if (user === undefined) user = null;
    return user;
  },

  async deleteUserById(id) {
    const query = "DELETE FROM users WHERE _id = ?";
    await connection.query(query, [id]);
  },

  async deleteAll() {
    await connection.connect();
  
    const query = "DELETE FROM users";

    await connection.query(query);

  },
};
