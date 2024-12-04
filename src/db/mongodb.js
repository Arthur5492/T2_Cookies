import { MongoClient } from "mongodb";

const client = new MongoClient('mongodb://127.0.0.1:27017')
const dbName = "cookies-giveaway";

var db, users, cookies;

export async function connect_db(){
  await client.connect();
  db = await client.db(dbName);
  
  users = await db.collection("users");
  cookies = await db.collection("cookies");

  try {
    await populateUsers();
    await populateCookies();
  }
  catch (error) {
    console.log('error: ', error);
    throw error;
  }
}

export async function populateUsers() {
  try {
    const data = await fs.readFile(`${__dirname}/users.json`, 'utf8');
    let usersData = JSON.parse(data);

    usersData = usersData.map(u => {
      return {
        name: u.name,
        email: u.email,
        cookie_ids: u.cookie_ids
      };
    });

    for (let user of usersData) {
      await cadastrarProfessor(
        user.name,
        user.email,
        user.cookie_ids,
      );
    }
    console.log('users data ok');
  } 
  catch (error) {
    console.error('error users data', error);
    throw error;
  }
}

export async function populateCookies() {
  try {
    const data = await fs.readFile(`${__dirname}/cookies.json`, 'utf8');
    let cookiesData = JSON.parse(data);

    cookiesData = cookiesData.map(c => {
      return {
        cookie_id: c.name,
        name: c.email,
      };
    });

    for (let cookie of cookiesData) {
      await cadastrarProfessor(
        cookie.cookie_id,
        cookie.name,
      );
    }
    console.log('cookies data ok');
  } 
  catch (error) {
    console.error('error cookies data', error);
    throw error;
  }
}


export async function update_profile(name, email, password, phone, gender, birthDate){
  if (name || email || password || phone || gender || birthDate){
    let fields = {};

    if (name) fields.name = name;
    if (email) fields.email = email;
    if (password) fields.password = password;
    if (phone) fields.phone = phone;
    if (gender) fields.gender = gender;
    if (birthDate) fields.birthDate = birthDate;

    const result = await users.updateOne(
      { /* filtro para o usuário */ },
      { $set: fields },
      { upsert: true }
      )

    return result;
  }
}

export async function insert_cookie(cookie_id){
  if (cookie_id){
    const insertResult = await cookies.insertOne({_id: cookie_id});
    const updateResult = await users.updateOne(
      { /* filtro para o usuário */ },
      { $addToSet: { cookie_ids: cookie_id } },
      { upsert: true }
      )
    
    return { insertResult, updateResult };
  }
}

export async function giveaway(){
  const randomCookie = await db.collection("cookies").aggregate([{ $sample: { size: 1 } }]).toArray();
  console.log(randomCookie[0]); // Random Cookie

  // let id = await users.findOne( {cookie_id: randomCookie} );
  // return id;

}
