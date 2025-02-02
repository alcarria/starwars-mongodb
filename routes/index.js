var express = require('express');
var router = express.Router();
var o2x = require('object-to-xml');


require('../models/personaje'); 
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
Personaje = mongoose.model('Personaje');



/* GET home page. */
router.get('/', async (req, res, next) => {
  personajes = await Personaje.find();
  res.render('index', { title: 'Starwars page', personajes });  
});

router.post('/', async (req, res, next) =>  {
  var nuevoPersonaje = new Personaje({ "Nombre": req.body.nombre, "Fuerza": req.body.fuerza, "Faccion": req.body.faccion });
  await nuevoPersonaje.save();
  res.redirect('/');  
});

router.get('/personaje/:ID', async (req, res, next) => {
  var characterID = req.params.ID;
  var personaje = await Personaje.findOne({ '_id': new ObjectId(characterID) })
  res.render('personaje', { title: 'Character page', personaje });
});



router.post('/personaje/:ID', async (req, res, next) => {
  var characterID = req.params.ID;
  await Personaje.deleteOne({ '_id': new ObjectId(characterID) })
  res.redirect('/');
});


router.get('/xml', async (req, res, next) => {
  var personajes = await Personaje.find();
    //Pasando a string y luego de nuevo a JSON nos evitamos errores de conversion posteriores con o2x
    personajesFixed = JSON.parse(JSON.stringify(personajes));
    res.set('Content-Type', 'text/xml');
    res.send(o2x({
      '?xml version="1.0" encoding="utf-8"?': null, personajes: { "personaje": personajesFixed }
    }));
});


router.get('/json', async (req, res, next) => {
  var personajes = await Personaje.find();
  res.json(personajes);
});


module.exports = router;
