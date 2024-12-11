import { users, cookies, connect_db, crud_db, giveaway, authenticate_token } from './db/mongodb.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from "body-parser";
import express from 'express';
import cors from 'cors';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import webpush from 'web-push';
import { readFile } from 'fs/promises';
import { ObjectId } from 'mongodb';

const keys = JSON.parse(await readFile('./keys.json', 'utf8'));

dotenv.config();
const port = process.env.PORT;
const secretKey = process.env.SECRET_KEY;
const subject = process.env.SUBJECT; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(cors()); // Allow frontend requisitions




webpush.setVapidDetails(subject, keys.publicKey, keys.privateKey);

app.post('/subscribe', authenticate_token, async (req, res) => {
  const subscription = req.body;

  if (!subscription) {
    return res.status(400).json({ success: false, message: "Subscription data missing" });
  }

  try {
    const userId = req.userId;
    const objectId = new ObjectId(userId);

    const updateResult = users.updateOne(
      { _id: objectId },
      { $set: { pushSubscription: subscription } }, 
      { upsert: true }
    );

    if (updateResult) {
      res.status(201).json({ success: true, message: "Subscription saved" });
    } 
    else {
      res.status(200).json({ success: false, message: "Subscription already exists" });
    }

  } 
  catch (error) {
    console.error("Erro ao salvar inscrição:", error);
    res.status(500).json({ success: false, message: "Error at server" });
  }
});

app.post("/validate-token", authenticate_token, (req, res) => {
  const userId = req.userId;
  const objectId = new ObjectId(userId);
  res.status(200).json({ success: true, userId: objectId });
});

app.post('/validate-subscription', authenticate_token, async (req, res) => {
  const subscription = req.body;
  const userId = req.userId;
  const objectId = new ObjectId(userId);

  if (!subscription || !subscription.endpoint || !subscription.keys) {
    return res.status(400).json({ success: false, message: "Invalid subscription data" });
  }

  try {
    const user = await users.findOne({ _id: objectId });

    if (user) {
      // console.log("Subscription belongs to user:", user);
      res.status(200).json({ success: true, user });
    } 
    else {
      console.warn("Subscription not found in the database");
      res.status(404).json({ success: false, message: "Subscription not found" });
    }
  } catch (error) {
    console.error("Error validating subscription:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/send-notification", async (req, res) => {
  const { cookieId, message } = req.body;

  try {
    // Procura o usuário pelo cookieId
    const user = await users.findOne({ cookie_ids: cookieId });
    if (!user) {
      return res.status(404).json({ error: 'This cookieId does not exist at this giveaway' });
    }

    // Verifica se existe uma pushSubscription única
    const subs = user.pushSubscription;
    if (!subs || !subs.endpoint || !subs.keys) {
      return res.status(404).json({ error: 'Subscription not found for user' });
    }

    // Monta o payload da notificação
    const payload = JSON.stringify({
      title: "You won the giveaway!",
      body: message,
    });

    // Envia a notificação
    await webpush.sendNotification(subs, payload);

    // Responde com sucesso
    res.status(200).json({ success: true, message: "Notification sent!" });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ error: "Error at sending notification" });
  }
});





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
    console.error("Error at finding user:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/api/insert-cookie", authenticate_token, async (req, res) => {
  const { cookieId } = req.body;

  try {
    // Check if cookie is already in the db
    const existingCookie = await cookies.findOne({ _id: cookieId });
    if (existingCookie) {
      return res.status(409).json({ success: false, message: "This cookie has been already added" });
    }
    
    const userId = req.userId;
    const objectId = new ObjectId(userId);
    const user = await users.findOne({ _id: objectId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Insert cookie e and update user cookies
    const insertResult = await cookies.insertOne({ _id: cookieId });
    const updateResult = await users.updateOne(
      { _id: objectId },
      { $addToSet: { cookie_ids: cookieId } }
    );
    return res.status(200).json({ success: true, message: "Cookie added", insertResult, updateResult });
  } 
  catch (error) {
    console.error("Error at inserting cookie:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/api/update-profile", authenticate_token, async (req, res) => {
  const { name, email, password, phone, gender, birth_date } = req.body;
  const userId = req.userId;
  const objectId = new ObjectId(userId);

  try {
    const user = await users.findOne({ _id: objectId });
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
      { _id: objectId },
      { $set: fields },
      { upsert: true }
    );
    return res.status(200).json({ success: true, message: "Profile updated", updateResult});
  } 
  catch (error) {
    console.error("Error at updating profile:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/api/get-user-data", authenticate_token, async (req, res) => {
  try {
    const userId = req.userId;
    const objectId = new ObjectId(userId);
    const user = await users.findOne({ _id: objectId });
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

app.post("/api/sign-up", async (req, res) => {
  const { name, email, password, phone, gender, birth_date } = req.body;

  try {
    // Valida se todos os campos obrigatórios foram fornecidos
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Verifica se o email já está registrado
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already in use" });
    }

    // Cria o novo usuário
    const newUser = {
      name,
      email,
      password,
      phone,
      gender,
      birth_date,
    };

    const result = await users.insertOne(newUser);
    return res.status(201).json({ success: true, message: "User created successfully", userId: result.insertedId });
  }
  catch (error) {
    console.error("Error at signing up:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });

  }

});
  



app.listen(port, '0.0.0.0', function() {
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
