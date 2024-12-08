import { MongoClient } from "mongodb";
import fs from 'fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();
const secretKey = process.env.SECRET_KEY;

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
    await db.dropDatabase();
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

    // Itera sobre cada usuário no JSON
    for (let user of usersData) {
      const { email, ...userData } = user;

      // Atualiza ou insere o usuário no banco
      await users.updateOne(
        { email }, // Encontra o usuário pelo e-mail
        { $set: userData }, // Define os dados do usuário
        { upsert: true } // Cria o documento se ele não existir
      );
    }
    console.log('Users data populated successfully');
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
    console.log('Cookies data populated successfully');
  }
  catch (error) {
    console.error('Error cookies data: ', error);
    throw error;
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

    const user = await users.findOne({ cookie_ids: { $in: [randomCookie[0]] } });
    return user._id;
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

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: "Token expired" });

    req.userId = user.id;
    next();
  });
}


export { users, cookies, connect_db, crud_db, giveaway, authenticate_token };