const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = (db) => {
  const router = express.Router();
  const planets = db.collection('planets');
  const characters = db.collection('characters');
  const films = db.collection('films');
  const films_planets = db.collection('films_planets');

  router.get('/', async (req, res) => {
    const result = await planets.find().toArray();
    res.json(result);
  });

  router.get('/:id', async (req, res) => {
    const planet = await planets.findOne({ _id: new ObjectId(req.params.id) });
    res.json(planet);
  });

  router.get('/:id/characters', async (req, res) => {
    const planet = await planets.findOne({ _id: new ObjectId(req.params.id) });
    const result = await characters.find({ homeworld: planet.id }).toArray();
    res.json(result);
  });

  router.get('/:id/films', async (req, res) => {
    const planet = await planets.findOne({ _id: new ObjectId(req.params.id) });
    const links = await films_planets.find({ planet_id: planet.id }).toArray();
    const filmIds = links.map(link => link.film_id);
    const result = await films.find({ id: { $in: filmIds } }).toArray();
    res.json(result);
  });

  return router;
};
