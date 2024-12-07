import { users, cookies, connect_db, crud_db, giveaway, authenticate_token } from './src/db/mongodb.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from "body-parser";
import express from 'express';
import cors from 'cors';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT;
const secretKey = process.env.SECRET_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:5173', // Permite requisições da origem do frontend
}));



app.get('/', function(req,res) {
  res.send();
});

app.get('/api/db', function(req, res) {
  connect_db();
  res.send();
});

app.get('/api/crud', function(req, res) {
  crud_db();
  res.send();
});

app.get('/api/giveaway', function(req, res) {
  giveaway();
  res.send();
});



app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await users.findOne({ email, password });
    if (!user) {      
      return res.status(401).json({ success: false, message: "Login failed" });
    } 

    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "1h" });
    return res.status(200).json({ success: true, message: "Login success", user, token });
  } 
  catch (error) {
    console.error("Error on finding user:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/api/insert_cookie", authenticate_token, async (req, res) => {
  const { cookie_id, user_id } = req.body;

  try {
    // Check if cookie is already in the db
    const existingCookie = await cookies.findOne({ _id: cookie_id });
    if (existingCookie) {
      return res.status(409).json({ success: false, message: "This cookie has been already added" });
    }

    const user = await users.findOne({ _id: user_id });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Insert cookie e and update user cookies
    const insertResult = await cookies.insertOne({ _id: cookie_id });
    const updateResult = await users.updateOne(
      { _id: user_id },
      { $addToSet: { cookie_ids: cookie_id } }
    );
    return res.status(200).json({ success: true, message: "Cookie added", insertResult, updateResult });
  } 
  catch (error) {
    console.error("Error on insert cookie:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/api/update_profile", authenticate_token, async (req, res) => {
  const { name, email, password, phone, gender, birth_date } = req.body;

  try {
    const user = await users.findOne({ _id: req.user_id });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let fields = {};
    if (name) fields.name = name;
    if (email) fields.email = email;
    if (password) fields.password = password;
    if (phone) fields.phone = phone;
    if (gender) fields.gender = gender;
    if (birth_date) fields.birth_date = birth_date;

    const updateResult = await users.updateOne(
      { _id: user._id },
      { $set: fields },
      { upsert: true }
    );
    return res.status(200).json({ success: true, message: "Profile updated", updateResult});
  } 
  catch (error) {
    console.error("Error on updating profile:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/api/get_user_data", authenticate_token, async (req, res) => {
  try {
    const user = await users.findOne({ _id: req.user_id });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, message: "Data fetched", user});
  } 
  catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});
  



app.listen(port, function() {
    console.log('Server running on 3000');
});

app.get(/^(.+)$/, function (req, res) {
    try {
      res.write("This page does not exist")
      res.end();
    }
    catch(e) {
      res.end();
    }    
});
