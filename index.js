const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gvjclco.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   serverApi: ServerApiVersion.v1,
});

async function run() {
   try {
      const projectsCollection = client.db("portfoliyo").collection("projects");

      app.get("/projects", async (req, res) => {
         const result = await projectsCollection
            .find({})
            .sort({ $natural: -1 })
            .toArray();
         res.send(result);
      });
      app.get("/project/:type", async (req, res) => {
         const filter = { projectType: req.params.type };
         const result = await projectsCollection
            .find(filter)
            .sort({ $natural: -1 })
            .toArray();
         res.send(result);
      });

      app.get("/projects/:id", async (req, res) => {
         const id = req.params.id;
         const filter = { _id: ObjectId(id) };
         const result = await projectsCollection.find(filter).toArray();
         res.send(result);
      });

      app.post("/project", async (req, res) => {
         const result = await projectsCollection.insertOne(req.body);
         res.send(result);
      });
   } finally {
   }
}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
   res.send("Server is running...");
});

app.listen(port, () => {
   console.log(`Server is running...on ${port}`);
});
