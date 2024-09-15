const express = require('express');
const { MongoClient, ServerApiVersion } = require("mongodb");
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// MongoDB Atlas connection string
const uri = "mongodb+srv://subhash613d:Subhash316d@cluster0.xuckj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with MongoClientOptions to set the Stable API version
const client = new MongoClient(uri,  {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
  try {
    // Connect the client to the MongoDB server
    await client.connect();

    // Database and Collection
    const db = client.db("Sample"); // Replace "Sample" with your actual database name
    const collection = db.collection("Sample1"); // Replace "Sample1" with your actual collection name

    console.log("Connected to MongoDB!");

    // API endpoint to insert data into MongoDB
    app.post('/add-to-mongo', async (req, res) => {
      const sheetData = req.body.data; 

      try {
        const result = await collection.insertMany(sheetData); // Insert data into MongoDB
        res.status(200).send('Data inserted successfully');
        console.log('Data inserted:', result);
      } catch (error) {
        res.status(500).send('Error inserting data');
        console.error('Error inserting data:', error);
      }
    });

    // API endpoint to fetch all data from the MongoDB collection
    app.get('/get-data', async (req, res) => {
      try {
        const data = await collection.find({}).toArray(); // Fetch all data
        res.status(200).json(data);
        console.log('Data fetched:', data);
      } catch (error) {
        res.status(500).send('Error fetching data');
        console.error('Error fetching data:', error);
      }
    });

    // Start the Express server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (err) {
    console.error(err);
  }
}

run().catch(console.dir);
