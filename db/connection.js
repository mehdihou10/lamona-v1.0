import postgres from "postgres";

// const pool = postgres({

//     host: "localhost",
//     user: "postgres",
//     password: process.env.PASSWORD,
//     database: process.env.DB,

// })

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const pool = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: process.env.PORT_DB,
  ssl: 'require',
  connection: {
    options: `project=${ENDPOINT_ID}`,
  }
  

});

async function verifyConnection() {
    try {
      const result = await pool`select version()`;
      
      console.log("Welcome To Mehdi Empire")
    } catch (err) {
      throw new Error(err);
    }
  }
  
  verifyConnection();

  export default pool;
