const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));

const { parse } = require('dotenv');
var express = require('express');
var jwt = require('jsonwebtoken');
var common = require('../common');
var sessionStore = require('../mockSessionStore');
var router = express.Router();

router.get('/', sessionStore.authenticateToken, function(req, res, next) {
  if (req.email===null||!sessionStore.hasOwnProperty(req.email)){
    res.sendStatus(403);
  }

  const options = {
    method: "GET",
    headers: {
      "Authorization": "Bearer "+ sessionStore[req.email].token,
      ...common.HEADERS,
    }
  }

  fetch(common.URL+"/virtualcards", options)
    .then(async (extendRes) => {
      if (extendRes.status!==200) {
        res.status(extendRes.status).json({"error": "Something went wrong retrieving cards"});
      } else {
        const parsedRes = await extendRes.json();
        res.json({
          "virtualCards": Object.entries(parsedRes.virtualCards).map(([key, value]) => ({
            "firstName": value.recipient.firstName,
            "lastName": value.recipient.lastName,
            "cardImageUrl": value.cardImage.urls.large,
            "displayName": value.displayName,
            "currency": value.currency,
            "balanceCents": value.balanceCents,
            "address": value.address,
            "expires": value.expires,
            "last4": value.last4,
          }))
        }
        );
      }
    })
});

module.exports = router;
