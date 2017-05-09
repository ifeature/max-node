var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var url = 'mongodb://localhost:27017/test';

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', {
//       title: 'Form validation',
//       success: req.session.success,
//       errors: req.session.errors,
//       condition: true,
//       anyArray: [1, 2, 3, 4, 5]
//   });
//   console.log('sessionID', req.session.id);
//   req.session.errors = null;
//   req.session.success = null;
// });

router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/get-data', function(req, res, next) {
    var resultArray = [];
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection('user-data').find();
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
           resultArray.push(doc);
        }, function() {
            db.close();
            res.render('index', { items: resultArray });
        });
    });
});

router.post('/insert', function(req, res, next) {
    var item = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };

    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('user-data').insertOne(item, function(err, result) {
            assert.equal(null, err);
            console.log('Item inserted ', result);
            db.close();
        });
    });

    res.redirect('/');
});

router.post('/update', function(req, res, next) {
    var item = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };

    var id = req.body.id;

    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('user-data').updateOne(
            { '_id': objectId(id) },
            { $set: item },
            function(err, result) {
                assert.equal(null, err);
                console.log('Item updated ', result);
                db.close();
            }
        );
    });
});

router.post('/delete', function(req, res, next) {
    var id = req.body.id;

    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('user-data').deleteOne(
            { '_id': objectId(id) },
            function(err, result) {
                assert.equal(null, err);
                console.log('Item deleted ', result);
                db.close();
            }
        );
    });
});

router.post('/submit', function(req, res, next) {
    req.check('email', 'Invalid email address').isEmail();
    req.check('password', 'Password is invalid').isLength({ min: 4 }).equals(req.body.confirmPassword);

    const errors = req.validationErrors();

    if (errors) {
        req.session.errors = errors;
        req.session.success = false;
    } else {
        req.session.success = true;
    }

    res.redirect('/');
});

router.get('/users', function (req, res, next) {
    res.send('/users');
});

router.get('/test/:id', function(req, res, next) {
   res.render('test', {output: req.params.id});
});

router.post('/test/submit', function(req, res, next) {
    const id = req.body.id;
    res.redirect('/test/' + id);

});


module.exports = router;
