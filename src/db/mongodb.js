const {MongoClient} = require('mongodb');
const { createHmac } = require('crypto');
const fs = require('fs').promises;  // Usando a versão assíncrona do fs

const client = new MongoClient('mongodb://127.0.0.1:27017')
const dbName = "cookies-giveaway";

var db, user, cookie;

async function conecta(){
  await client.connect();
  db = await client.db(dbName);
  
  user = await db.collection("user");
  cookie = await db.collection("cookie");
}