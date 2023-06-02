import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import pizzas from "./controllers/pizzas";
import orders from "./controllers/orders";

dotenv.config();

const app = express();

// Middleware
const logging = (request, response, next) => {
  console.log(`${request.method} ${request.url} ${Date.now()}`);
  next();
};

// CORS Middleware
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

app.use(cors);
app.use(express.json());

const MONGODB = process.env.MONGODB || "mongodb://localhost/pizza";

// Database stuff
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

app.route("/").get((request, response) => {
  response.send("HELLO WORLD");
});

app.get("/status", (request, response) => {
  response.send(JSON.stringify({ message: "Service running ok" }));
});

app
  .route("/posts")
  .get((request, response) => {
    // express adds a "params" Object to requests
    const id = request.params.id;
    let data = "The ID equals " + id;
    // handle GET request for post with an id of "id"
    if (request.query) {
      if (request.query.type) {
        if (request.query.type === "json") {
          data = { id: request.params.id, q: request.query };
        }
      }
    }
    response.status(418).json(data);
  })
  .post((request, response) => {
    response.json(request);
  });

// Moving the logging here so that the logs on render.com are not filled up with status checks
app.use(logging);

app.use("/pizzas", pizzas);
app.use("/orders", orders);

const PORT = process.env.PORT || 4040;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
