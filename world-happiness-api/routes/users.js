var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

function isValidDate(dateString) {
  const dateRegExp = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(dateRegExp)) return false; // Invalid format
  let date = new Date(dateString);
  let dateNum = date.getTime();
  if (!dateNum && dateNum !== 0) return false; // Invalid date
  return date.toISOString().slice(0,10) === dateString;
};

/* Register user */
router.post('/register', function(req, res, next) {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({error: true, message: 'Request body incomplete, both email and password are required.'});
  } else {
    const user = {
      'email': req.body.email,
      'password': req.body.password
    }

    req.db('users').insert(user)
    .then(_ => {
      res.status(201).json({ message: 'User created.'});
    })
    .catch(error => {
      res.status(409).json({error: true, message: 'User already exists.'});
    })
  }
});

router.post('/login', function(req, res, next) {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({error: true, message: 'Request body incomplete, both email and password are required.'});
  } else {
    req.db.from('users').select('password').where('email', '=', req.body.email)
    .then(rows => {
      if (!rows[0].password || rows[0].password !== req.body.password) {
        res.status(401).json({error: true, message: 'Incorrect email or password.'});
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
          console.log('error when updating user token.');
          updateError = true;
        })

        if (!updateError) {
          res.status(200).json({
            token: generatedToken,
            token_type: 'Bearer',
            expires_in: 86400
          });
        }
      }
    })
    .catch((err) => {
      res.status(401).json({error: true, message: 'Incorrect email or password.'});
    })
  }
});

router.get('/:email/profile', function(req, res, next) {
  req.db.from('users').select('email').where('email', '=', req.params.email)
  .then(rows => {
    if (rows.length === 0) {
      res.status(404).json({error: true, message: 'User not found.'});
    } else if (req.headers.authorization && req.headers.authorization.substring(0, 'Bearer '.length) !== 'Bearer ') {
      res.status(401).json({error: true, message: 'Authorization header is malformed.'});
    } else {
      let authError = false;
      let authorised = false;

      if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ').pop();

        req.db.from('users').select('email').where('token', '=', token)
        .then(rows => {
          if (rows.length === 0) {
            res.status(401).json({error: true, message: 'Invalid JWT token.'});
            authError = true;
          } else {
            if (rows[0].email === req.params.email) {
              authorised = true;
            }

            const verified = jwt.verify(token, process.env.PRIVATE_KEY);

            if (verified.exp > Date.now()) {
              res.status(401).json({error: true, message: 'JWT token has expired.'});
              authError = true;
            }
          }
        })
        .catch(err => {
          res.json({error: true, message: 'Error in MySQL query when checking if token exists.'});
        })
      }
      if (!authError) {
        req.db.from('users').select('email', 'firstName', 'lastName', 'dob', 'address').where('email', '=', req.params.email)
        .then (rows => {
          const user = {
            'email': rows[0].email,
            'firstName': rows[0].firstName,
            'lastName': rows[0].lastName
          }
          
          if (req.headers.authorization && authorised) {
            let retrievedDate = rows[0].dob;
            if (retrievedDate != null) {
              retrievedDate = new Date(retrievedDate.toString());
              retrievedDate.setDate(retrievedDate.getDate() + 1);
              retrievedDate = retrievedDate.toISOString().slice(0, 10);
            }
            user['dob'] = retrievedDate;
            user['address'] = rows[0].address;
          }
          
          res.status(200).json(user);
        })
        .catch(err => {
          res.json({error: true, message: 'Error in MySQL query when retrieving user profile.'});
        })
      }
    }
  })
  .catch(err => {
    res.json({error: true, message: 'Error in MySQL query when checking if email exists.'});
  })
});

router.put('/:email/profile', function(req, res, next) {
  if (!req.headers.authorization) {
    res.status(401).json({error: true, message: "Authorization header ('Bearer token') not found."});
  } else if (req.headers.authorization.substring(0, 'Bearer '.length) !== 'Bearer ') {
    res.status(401).json({error: true, message: 'Authorization header is malformed.'});
  } else {
    const token = req.headers.authorization.split(' ').pop();

    req.db.from('users').select('email').where('token', '=', token)
    .then(rows => {
      if (rows.length !== 1) {
        res.status(401).json({error: true, message: 'Invalid JWT token.'});
      } else if (rows[0].email !== req.params.email) {
        res.status(403).json({error: true, message: 'Forbidden.'});
      } else {
        const verified = jwt.verify(token, process.env.PRIVATE_KEY);

        if (verified.exp > Date.now()) {
          res.status(401).json({error: true, message: 'JWT token has expired'});
        } else {
          if (!(req.body.email || req.body.firstName || req.body.lastName || req.body.dob || req.body.address)) {
            res.status(400).json({error: true, message: 'Request body incomplete: firstName, lastName, dob and address are required.'});
          } else if (typeof req.body.firstName !== 'string' ||
                     typeof req.body.lastName !== 'string' ||
                     typeof req.body.address !== 'string') {
            res.status(400).json({error: true, message: 'Request body invalid, firstName, lastName and address must be strings only.'});
          } else if (!isValidDate(req.body.dob)) {
            res.status(400).json({error: true, message: 'Invalid input: dob must be a real date in format YYYY-MM-DD.'});
          } else if (Date.parse(req.body.dob) >= Date.now()) {
            res.status(400).json({error: true, message: 'Invalid input: dob must be a date in the past.'});
          } else {
            const filter = {
              'email': req.params.email
            };

            const user = {
              'firstName': req.body.firstName,
              'lastName': req.body.lastName,
              'dob': req.body.dob,
              'address': req.body.address
            }

            req.db('users').where(filter).update(user)
            .then(_ => {
              req.db.from('users').select('email', 'firstName', 'lastName', 'dob', 'address').where('email', '=', req.params.email)
              .then(rows => {
                let retrievedDate = rows[0].dob;
                if (retrievedDate != null) {
                  retrievedDate = new Date(retrievedDate.toString());
                  retrievedDate.setDate(retrievedDate.getDate() + 1);
                  retrievedDate = retrievedDate.toISOString().slice(0, 10);
                }
                res.status(200).json({
                  email: rows[0].email,
                  firstName: rows[0].firstName,
                  lastName: rows[0].lastName,
                  dob: retrievedDate,
                  address: rows[0].address
                });
              })
              .catch(err => {
                console.log('Error in MySQL query when retrieving updated user profile.');
              });
            })
            .catch(err => {
              console.log('Error in MySQL query when updating user profile.');
            });
          }
        }
      }
    })
    .catch(err => {
      console.log('Error in MySQL query when checking if token exists.');
    });
  }
});

module.exports = router;
