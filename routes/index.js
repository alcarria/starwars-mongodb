var express = require('express');
var router = express.Router();
var o2x = require('object-to-xml');


require('../models/personaje'); 
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
Personaje = mongoose.model('Personaje');

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

/* GET home page. */
router.get('/', isLoggedIn, async (req, res, next) => {
  personajes = await Personaje.find();
  res.render('index', { title: 'Starwars page', personajes, user: req.user });  
});

router.post('/', async (req, res, next) =>  {  
  var geo = { type: "LineString", coordinates: JSON.parse(req.body.ruta) };
  var nuevoPersonaje = new Personaje({ "Nombre": req.body.nombre, "Fuerza": req.body.fuerza, "Faccion": req.body.faccion, "geo": geo });
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

/* GET geojson para mapa leaflet */
router.get('/geojson', async (req, res, next) => {

  var personajes = await Personaje.find();
  var geojson_response = {type: "FeatureCollection", features: []};

  personajes.forEach(function(personaje) {

    if (personaje.geo.coordinates == null) personaje.geo = null;
    
    var geojson_feature = {
      type : "Feature",
      id: personaje._id,
      properties : {nombre: personaje.Nombre, fuerza: personaje.Fuerza, faccion: personaje.Faccion},
      geometry : personaje.geo
    }
    geojson_response.features.push(geojson_feature);
  });
 
  res.json(geojson_response);
});



module.exports = router;
