import { users, cookies, connect_db, crud_db, update_profile, giveaway, authenticate_token } from './src/db/mongodb.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from "body-parser";
import express from 'express';
import cors from 'cors';
import jwt from "jsonwebtoken";

const SECRET_KEY = "123";
const PORT = 3000;

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
    if (user) {
      const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
      console.log("Token saved", token);

      res.status(200).json({ success: true, message: "Login success", user, token });
    } 
    else {
      res.status(401).json({ success: false, message: "Login failed" });
    }
  } 
  catch (error) {
    console.error("Error on finding user:", error);
    res.status(500).json({ success: false });
    throw error;
  }

  res.send();
});

app.post("/api/insert_cookie", authenticate_token, async (req, res) => {
  const { cookie_id } = req.body;

  try {
    const user = await users.findOne({ _id: req.user_id });
    const insertResult = await cookies.insertOne({ _id: cookie_id });
    const updateResult = await users.updateOne(
      { _id: req.user_id },
      { $addToSet: { cookie_ids: cookie_id } }
    );

    res.status(200).json({ success: true, insertResult, updateResult });
  } catch (error) {
    console.error("Error on insert cookie:", error);
    res.status(500).json({ success: false });
  }
});



app.listen(PORT, function() {
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
