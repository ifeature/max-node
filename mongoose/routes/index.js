var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/test');

mongoose.Promise = Promise;

var userDataSchema = new Schema({
    title: String,
    content: String,
    author: String
}, {
    collection: 'user-data'
});

var UserData = mongoose.model('UserData', userDataSchema);

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

router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/get-data', function (req, res, next) {
    UserData.find().then(function(docs) {
       res.render('index', { items: docs });
    });
});

router.post('/insert', function (req, res, next) {
    var item = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };

    var data = new UserData(item);
    data.save().then(function() {
        console.log('Item inserted');
    });

    res.redirect('/');
});

router.post('/update', function (req, res, next) {
    var item = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };

    var id = req.body.id;

    UserData.findById(id, function(err, doc) {
        if (err) {
            console.log('Error: Entry was not found.');
        }

        doc.title = req.body.title;
        doc.content = req.body.content;
        doc.author = req.body.author;

        doc.save();
    });

    res.redirect('/');
});

router.post('/delete', function (req, res, next) {
    var id = req.body.id;

    UserData.findByIdAndRemove(id).exec();

    res.redirect('/');
});

router.post('/submit', function (req, res, next) {
    req.check('email', 'Invalid email address').isEmail();
    req.check('password', 'Password is invalid').isLength({min: 4}).equals(req.body.confirmPassword);

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

router.get('/test/:id', function (req, res, next) {
    res.render('test', {output: req.params.id});
});

router.post('/test/submit', function (req, res, next) {
    const id = req.body.id;
    res.redirect('/test/' + id);

});


module.exports = router;
