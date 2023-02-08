//  Work around to use ES6 in CommonJS
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));

var express = require('express');
var common = require('../common');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  
});

// 
router.post('/signin', function(req, res, next) {
  if (!Object.keys(req.body).length || !req.body.email) {
    res.status(400).json({error: "No login email provided"});
  } else if (!req.body.password){
    res.status(400).json({error: "No password provided"});
  } else {
    const options = {
      method: "POST",
      headers: common.HEADERS, 
      body: JSON.stringify({
        "email": req.body.email,
        "password": req.body.password,
      }),
    }
    fetch(common.URL+"/signin", options) 
      .then(async (extendRes) => {
        if (extendRes.status!==200){
          res.status(extendRes.status).json({"error": "Incorrect login information"});
        } else {
          const parsedRes = await extendRes.json();
          res.json({
            "firstName": parsedRes.user.firstName,
            "lastName": parsedRes.user.lastName,
            "email": parsedRes.user.email,
            "phone": parsedRes.user.phone,
          });
        }});
  }
});

module.exports = router;
