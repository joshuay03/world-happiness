var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

/* Register user */
router.post('/register', function(req, res, next) {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({error: true, message: "Request body incomplete, both email and password are required"});
  } else {
    const user = {
      'email': req.body.email,
      'password': req.body.password
    }

    req.db('users').insert(user)
    .then(_ => {
      res.status(201).json({ message: 'User created'});
    })
    .catch(error => {
      res.status(409).json({error: true, message: "User already exists"});
    })
  }
});

router.post('/login', function(req, res, next) {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({error: true, message: "Request body incomplete, both email and password are required"});
  } else {
    req.db.from('users').select("password").where('email', '=', req.body.email)
    .then(rows => {
      if (!rows[0].password || rows[0].password !== req.body.password) {
        res.status(401).json({error: true, message: "Incorrect email or password"});
      } else {
        // Create token on successful login
        const generatedToken = jwt.sign({email: req.body.email, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)}, process.env.PRIVATE_KEY);
        
        const filter = {
          'email': req.body.email,
          'password': req.body.password
        }

        const token = {
          'token': generatedToken
        }

        let updateError = false;

        req.db('users').where(filter).update(token)
        .catch(error => {
          console.log("whoops");
          res.status(409).json({error: true, message: "error when updating user token"});
          updateError = true;
        })

        if (!updateError) {
          res.status(200).json({
            token: generatedToken,
            token_type: "Bearer",
            expires_in: 86400
          });
        }
      }
    })
    .catch((err) => {
      res.status(401).json({error: true, message: "Incorrect email or password"});
    })
  }
});

module.exports = router;
