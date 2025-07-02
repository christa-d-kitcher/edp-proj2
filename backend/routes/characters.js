const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = (db) => {
  const router = express.Router();
  const characters = db.collection('characters');
  const planets = db.collection('planets');
  const films = db.collection('films');
  const links = db.collection('films_characters');

  // Get all characters
  router.get('/', async (req, res) => {
    const result = await characters.find().toArray();
    res.json(result);
  });

  // Get character by Mongo _id
  router.get('/:id', async (req, res) => {
    const character = await characters.findOne({ _id: new ObjectId(req.params.id) });
    res.json(character);
  });

  // Get homeworld using numeric "homeworld" field (NOT ObjectId!)
  router.get('/:id/planet', async (req, res) => {
    const c = await characters.findOne({ _id: new ObjectId(req.params.id) });
    const p = await planets.findOne({ id: c.homeworld });
    res.json(p);
  });

  // Get films using numeric film_id links
  router.get('/:id/films', async (req, res) => {
    const c = await characters.findOne({ _id: new ObjectId(req.params.id) });
    const fc = await links.find({ character_id: c.id }).toArray();
    const filmIds = fc.map(link => link.film_id);
    const result = await films.find({ id: { $in: filmIds } }).toArray();
    res.json(result);
  });

  return router;
};
