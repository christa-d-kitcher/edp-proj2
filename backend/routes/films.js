const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = (db) => {
  const router = express.Router();
  const films = db.collection('films');
  const characters = db.collection('characters');
  const planets = db.collection('planets');
  const films_characters = db.collection('films_characters');
  const films_planets = db.collection('films_planets');

  router.get('/', async (req, res) => {
    const result = await films.find().toArray();
    res.json(result);
  });

  router.get('/:id', async (req, res) => {
    const film = await films.findOne({ _id: new ObjectId(req.params.id) });
    res.json(film);
  });

  router.get('/:id/characters', async (req, res) => {
    const film = await films.findOne({ _id: new ObjectId(req.params.id) });
    const links = await films_characters.find({ film_id: film.id }).toArray();
    const characterIds = links.map(link => link.character_id);
    const result = await characters.find({ id: { $in: characterIds } }).toArray();
    res.json(result);
  });

  router.get('/:id/planets', async (req, res) => {
    const film = await films.findOne({ _id: new ObjectId(req.params.id) });
    const links = await films_planets.find({ film_id: film.id }).toArray();
    const planetIds = links.map(link => link.planet_id);
    const result = await planets.find({ id: { $in: planetIds } }).toArray();
    res.json(result);
  });

  return router;
};
