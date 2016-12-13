var express = require('express');
var router = express.Router();
var request = require('request');

// Set our models (require schemas)
var Note = require('../models/Note.js');
var Article = require('../models/Article.js');

// Scrapers
var mongoose = require('mongoose');
var cheerio = require('cheerio');

// Database configuration with mongoose  (this is where mongo URI goes)
// 'mongodb://localhost/scrapeDB' || 
mongoose.connect(
	'mongodb://heroku_2gr2hrvz:qu90mv97r3n4nqunrcn968sikr@ds133348.mlab.com:33348/heroku_2gr2hrvz');
var db = mongoose.connection;

// Show any mongoose errors
db.on('error', function (err) {
	console.log('Mongoose Error: ', err);
});

//Logged in to db through mongoose, log message
db.once('open', function() {
	console.log('Mongoose connection successful.');
});

// Route for home
router.get('/', function(req, res) {
	res.redirect('/home');
});

// Route using site and cheerio
router.get('/home', function(req, res) {
  	request('http://www.ethertongallery.com/html/artist_detail.php?recordID=10', function(error, response, html) {
	    var $ = cheerio.load(html);
	    $('em').find('a').each(function(i, element) {

			var result = {};

			// result.title = $(this).attr.text();
			result.link = $(this).attr('href');
			result.title = $(this).attr('title');
			

			var entry = new Article (result);

			entry.save(function(err, doc) {
			  if (err) {
			    console.log(err);
			  } else {
			    console.log(doc);
			  }
			});
		});
	});	
	res.render('home');
});		

// Route to see articles saved
router.get('/articles', function(req, res) {
	Article.find({}, function(err, doc){
		if (err) {
			console.log(err);
		} else {
			res.json(doc); //this is where json is displayed
		}
	});
});

// Route
router.get('/articles/:id', function(req, res) {
	Article.findOne({'_id': req.params.id})
	.populate('note')
	.exec(function(err, doc) {
		if (err) {
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});

// MY ORIGINAL DELETE ROUTE
// router.post('/deletenote/:id', function(req, res) {
// 	console.log(req.params.id);
// 	Note.findOne({ '_id': req.params.id })
// 	.remove('note')
// 	.exec(function(err, doc) {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			res.json(doc);
// 		}
// 	});
// });

// Route to delete notes
router.delete('/deletenote/:id', function(req, res) {
	console.log(req.params.id);
	Note.remove({ '_id': req.params.id })
	// .remove('note')
	.exec(function(err, doc) {
		if (err) {
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});


// Route to replace existing note of article with new one
router.post('/articles/:id', function(req, res) {
	var newNote = new Note(req.body);

	newNote.save(function(err, doc) {
		if (err) {
			console.log(err);
		} else {
			Article.findOneAndUpdate({'_id': req.params.id},{$push: {'note':doc._id}},{new: true })
			.exec(function(err, doc) {
				if (err) {
					console.log(err);
				} else {
					res.send(doc);
				}
			});
		}
	});
});


module.exports = router;

