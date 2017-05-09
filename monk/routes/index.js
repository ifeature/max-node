var express = require('express');
var router = express.Router();
var db = require('monk')('localhost:27017/test');
var userData = db.get('user-data');

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
    var data = userData.find({}).then(function(docs) {
       res.render('index', { items: docs });
    });
});

router.post('/insert', function(req, res, next) {
    var item = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };

    userData.insert(item).then(function() {
        console.log('Item inserted');
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

    // userData.update({ '_id': db.id(id) }, item);
    userData.updateById(id, item);
});

router.post('/delete', function(req, res, next) {
    var id = req.body.id;

    // userData.remove({ '_id': db.id(id) });
    userData.removeById(id);
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
