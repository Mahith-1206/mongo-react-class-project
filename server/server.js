const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

app.use(cors());

// MongoDB connection URI
const uri = 'mongodb+srv://aishwarya:aishwarya@webdevcourse.xkxb37x.mongodb.net/?retryWrites=true&w=majority';

// Connect to MongoDB
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connect() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

connect();

// Define a route to fetch data from MongoDB
app.get('/api/data', async (req, res) => {
    try {
        console.log("api hit");
        const database = client.db('sample_airbnb'); 
        const collection = database.collection('testing'); 

        const data =  await collection.find({}).limit(5).toArray();
        console.log("collection " + collection.find({}))
        console.log("data" + data);

        if (data.length === 0) {
            console.log('No documents found in the collection.');
        }

        res.json(data);
    } catch (err) {
        console.error('Error fetching data from MongoDB:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/api/insert/:name', async (req, res) => {
    try {
        console.log("name from body" + req.params.name);
        const database = client.db('sample_airbnb');
        const collection = database.collection('testing'); 

        const  name  = req.params.name;

        console.log("name from body" + name);

        // Insert the data into the collection
        const result = await collection.insertOne({ name });

        res.json({ message: 'Data inserted successfully', insertedId: result.insertedId });
    } catch (err) {
        console.error('Error inserting data into MongoDB:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});