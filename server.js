const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const config = require('./config');

const app = express();
const port = 3000;

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

let db;

async function connectToDb() {
    try {
        const client = new MongoClient(config.MONGO_URI);
        await client.connect();
        db = client.db(config.DATABASE_NAME);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Could not connect to MongoDB', error);
        process.exit(1);
    }
}

// A simple route to render the main page
app.get('/', async (req, res) => {
    if (!db) {
        return res.status(500).send('Database not connected');
    }

    try {
        const collection = db.collection(config.COLLECTION_NAME);
        const images = await collection.find({}).toArray();

        const formattedImages = images.map(image => {
            if (image[config.IMAGE_FIELD_NAME] && image[config.IMAGE_FIELD_NAME].buffer) {
                return {
                    ...image,
                    [config.IMAGE_FIELD_NAME]: `data:image/jpeg;base64,${image[config.IMAGE_FIELD_NAME].buffer.toString('base64')}`
                };
            }
            return image;
        });

        res.render('index', { images: formattedImages });
    } catch (error) {
        console.error('Failed to fetch images', error);
        res.status(500).send('Failed to fetch images');
    }
});

connectToDb().then(() => {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
});