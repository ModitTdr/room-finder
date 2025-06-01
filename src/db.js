import pg from "pg";
import dotenv from "dotenv"
dotenv.config();

const {Pool} = pg;

const db = new Pool({
  user: process.env.DBUSER,
  host: process.env.DBHOST,
  database: process.env.DBNAME,
  password: process.env.DBPASSWORD,
  port: process.env.DBPORT
});

db.on("connect", () => {
  console.log("Connected to Database");
})
db.on("error", (error) => {
  console.log("Unexpected error",error);
  process.exit(-1);
})

export default db;