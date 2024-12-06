import { MongoClient } from "mongodb";
import fs from 'fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import jwt from "jsonwebtoken";

const SECRET_KEY = "123";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mongoURI = "mongodb://127.0.0.1:27017";
const dbName = "COOKIES-GIVEAWAY";

var db, users, cookies;

async function connect_db(){
  const client = new MongoClient(mongoURI)
  await client.connect();
  db = client.db(dbName);
  
  users = db.collection("users");
  cookies = db.collection("cookies");

  console.log('Database connected');
}

async function crud_db(){
  try {
    await populate_users();
    await populate_cookies();
  }
  catch (error) {
    console.log('Error: ', error);
    throw error;
  }
}

async function populate_users() {
  try {
    const data = await fs.readFile(`${__dirname}/users.json`, 'utf8');
    let usersData = JSON.parse(data);

    for (let user of usersData) {
      await users.updateOne(
        { _id: user._id }, // Filtro para encontrar o documento
        { 
          $set: {
            name: user.name,
            email: user.email,
            password: user.password,
            cookie_ids: user.cookie_ids
          }
        },
        { upsert: true } // Cria o documento se não existir
      );
    }
    console.log('Users data ok');
  } 
  catch (error) {
    console.error('Error users data:', error);
    throw error;
  }
}

async function populate_cookies() {
  try {
    const data = await fs.readFile(`${__dirname}/cookies.json`, 'utf8');
    let cookiesData = JSON.parse(data);

    for (let cookie of cookiesData) {
      await cookies.updateOne(
        { _id: cookie._id }, // Filtro para encontrar o documento
        { 
          $set: {
            cookie_id: cookie.cookie_id,
            name: cookie.name,
          }
        },
        { upsert: true } // Cria o documento se não existir
      );
    }
    console.log('Cookies data ok');
  }
  catch (error) {
    console.error('Error cookies data: ', error);
    throw error;
  }
}



async function sign_user(_id, name, email, cookie_ids) {
  try {
    await users.updateOne(
      { _id: _id },
      {
        $set: {
          name: name,
          email: email,
          cookie_ids: cookie_ids
        }
      },
      { upsert: true }
    );
  } 
  catch (error) {
    console.error(`Error at user ${name}: `, error);
    throw error;
  }
}

async function update_profile(_id, name, email, password, phone, gender, birthDate){  
  if (name || email || password || phone || gender || birthDate){
    let fields = {};

    if (name) fields.name = name;
    if (email) fields.email = email;
    if (password) fields.password = password;
    if (phone) fields.phone = phone;
    if (gender) fields.gender = gender;
    if (birthDate) fields.birthDate = birthDate;

    const result = await users.updateOne(
      { _id: _id },
      { $set: fields },
      { upsert: true }
      )

    return result;
  }
}

async function giveaway() {
  try {
    // Seleciona um cookie aleatório usando $sample
    const randomCookie = await cookies.aggregate([{ $sample: { size: 1 } }]).toArray();

    if (randomCookie.length === 0) {
      throw new Error("There are no cookies in cookies collection");
    }

    console.log("Giveaway Cookie:", randomCookie[0]);
    return randomCookie[0];
  } 
  catch (error) {
    console.error("Error at the giveaway:", error);
    throw error;
  }
}

function authenticate_token(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ success: false, message: "No token provided" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: "Invalid token" });

    req.user_id = user.id;
    next();
  });
}


export { users, cookies, connect_db, crud_db, sign_user, update_profile, giveaway, authenticate_token };