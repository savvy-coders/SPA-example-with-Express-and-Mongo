import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import pizzas from "./routers/pizzas.js";
import orders from "./routers/orders.js";
import customers from "./routers/customers.js";

dotenv.config();

const app = express();

// Logging Middleware Declaration
const logging = (request, response, next) => {
  console.log(`${request.method} ${request.url} ${Date.now()}`);
  next();
};

// CORS Middleware Declaration
const cors = (req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Accept,Authorization,Origin"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
};

// Use the defined Middleward
app.use(cors);
app.use(express.json());

const MONGODB = process.env.MONGODB || "mongodb://localhost/pizza";

// Database connection
mongoose.connect(
  MONGODB,
  { 
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);
const db = mongoose.connection;

let db_status = "MongoDB connection not successful.";

db.on("error", console.error.bind(console, "connection error:"));
db.once(
  "open",
  console.log.bind(console, "Successfully opened connection to Mongo!")
);


// Define a status route
app.get("/status", (request, response) => {
  response.send(JSON.stringify({ message: "Service running ok" }));
});

// Moving the logging middleware to this location so that the logs on render.com are not filled up with status checks
app.use(logging);

// Use the routers
app.use("/pizzas", pizzas);
app.use("/orders", orders);
app.use("/customers", customers);

const PORT = process.env.PORT || 4040;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
