import express from 'express';
const app = express();
app.use(cors()); // Enable CORS for all routes
const PORT = 3001;

//Mongo drivers
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';


// Middleware to parse JSON bodies
app.use(express.json());

//Read environment variables values from .env
dotenv.config();
const url = process.env.MONGO_DB_URL;
const dbName = process.env.MONGO_DB;

const charsCollection = process.env.MONGO_DB_COLL_CHARACTERS;
const filmsCollection = process.env.MONGO_DB_COLL_FILMS;
const planetsCollection = process.env.MONGO_DB_COLL_PLANETS;
const films_charsCollection = process.env.MONGO_DB_COLL_FILMS_CHARACTERS;
const films_planetsCollection = process.env.MONGO_DB_COLL_FILMS_PLANETS;


//GET route for /api/planets
// Endpoint to read and send JSON file content
app.get('/api/planets', async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const collection = db.collection(planetsCollection);
        const planets = await collection.find({}).toArray();
        res.json(planets);
        return planets;
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Could not get planets");
    }
});

//GET route for /api/characters
app.get('/api/characters', async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const collection = db.collection(charsCollection);
        const characters = await collection.find({}).toArray();
        res.json(characters);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("No Star Wars for YOU.");
    }
});

//GET route for /api/films
app.get('/api/films', async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const collection = db.collection(filmsCollection);
        const films = await collection.find({}).toArray();
        res.json(films);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("No films found");
    }
});

//GET route for /api/characters/:id
app.get('/api/characters/:id', async (req, res) => {
    try {
        const charID = parseInt(req.params.id);
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const collection = db.collection(charsCollection);

        // const character = await collection.findOne({ "id": Number(charID) });

        // if(!character) {
        //     return res.status(404).send("No character found with that id.");
        // }
        // res.json(character);

        // res.json({ message: `Character with id ${charID} found successfully` });
        const character = await collection
            .aggregate([
                { $match: { id: charID } },
                {
                    $lookup: {
                        from: "planets",
                        localField: "homeworld",
                        foreignField: "id",
                        as: "homeworldInfo",
                    },
                },
                { $unwind: "$homeworldInfo" },
            ])
            .toArray();

        if (character.length === 0) {
            return res.status(200).json(character);
        }
        res.status(200).json(character[0])

    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("No character found");
    }
});


//GET route for /api/films/:id
app.get('/api/films/:id', async (req, res) => {
    try {

        const filmID = req.params.id;
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const collection = db.collection(filmsCollection);
        const film = await collection.findOne({ "id": Number(filmID) });

        if (!film) {
            return res.status(404).send("No film found with that id.");
        }
        res.json(film);

    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("This film does not exist");
    }
});


//GET route for /api/planets/:id
app.get('/api/planets/:id', async (req, res) => {
    try {

        const planetID = req.params.id;
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const collection = db.collection(planetsCollection);
        const planet = await collection.findOne({ "id": Number(planetID) });

        if (!planet) {
            return res.status(404).send("No planet found with that id.");
        }
        res.json(planet);

    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("This planet does not exist");
    }
});


//GET route for /api/films/:id/characters
app.get('/api/films/:id/characters', async (req, res) => {
    try {

        const filmID = req.params.id;
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const filmCharCollection = await db.collection(films_charsCollection);
        const characters = await filmCharCollection.find({ "film_id": parseInt(filmID) }).toArray();

        if (!characters) {
            return res.status(404).send("No characters found for film with that id.");
        }
        res.json(characters);

    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("This planet does not exist");
    }
});


//GET route for /api/films/:id/planets
app.get('/api/films/:id/planets', async (req, res) => {
    try {

        const filmID = req.params.id;
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const filmPlanetCollection = db.collection(films_planetsCollection);
        const planets = await filmPlanetCollection.find({ "film_id": parseInt(filmID) }).toArray();

        if (planets.length === 0) {
            return res.status(404).send("No planets found in this film");
        }
        res.json(planets);

    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("This film planet combo does not exist");
    }
});


//GET route for /api/characters/:id/films
app.get('/api/characters/:id/films', async (req, res) => {
    try {

        const charID = req.params.id;
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const characterFilmsCollection = db.collection(films_charsCollection);
        const films = await characterFilmsCollection.find({ "character_id": parseInt(charID) }).toArray();


        // const films = await collection
        //     .aggregate([
        //         // { $match: { id: charID } },
        //         {
        //             $lookup: {
        //                 from: "films",
        //                 localField: "film_id",
        //                 foreignField: "id",
        //                 as: "filmInfo",
        //             },
        //         },
        //         { $unwind: "$filmInfo" },
        //     ])
        //     .toArray();

        //     console.log("The films");
        //     console.log(films);

        if (films.length === 0) {
            return res.status(404).send("No films found for this character");
        }
        res.json(films);

    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("This charcter film combo does not exist");
    }
});

//GET route for /api/planets/:id/films
app.get('/api/planets/:id/films', async (req, res) => {
    try {

        const planetID = req.params.id;
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const filmPlanetCollection = db.collection(films_planetsCollection);
        const films = await filmPlanetCollection.find({ "planet_id": parseInt(planetID) }).toArray();
        if (films.length === 0) {
            return res.status(404).send("No Planets found in this film");
        }
        res.json(films);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("This film planet combo does not exist");
    }
});

//GET route for /api/planets/:id/characters
app.get('/api/planets/:id/characters', async (req, res) => {
    try {

        const planetID = req.params.id;
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);

        const characterCollection = db.collection(charsCollection);
        const characters = await characterCollection.find({ "homeworld": parseInt(planetID) }).toArray();
        if (characters.length === 0) {
            return res.status(404).send("No characters found in this planet");
        }
        res.json(characters);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("This planet character combo does not exist");
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});