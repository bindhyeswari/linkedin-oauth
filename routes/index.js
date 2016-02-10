var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function (req, res) {
    res.render('login');
});

router.post('/login', function setSignedCookie(req, res, next) {
  // is the username and pwd valid?
  // create the cookie
  // assign it to the header
  // req.user <--
  next();
}, function (req, res) {
    res.status(200).json({
      message: 'you are logged in ... '
    });
});

module.exports = router;
