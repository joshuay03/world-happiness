var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

/**
 * Function to check if a users token has expired
 * @param {string} token - The user's bearer token
 * @returns true if token is expired, else false
 */
 function isExpiredToken(token) {
  const verified = jwt.verify(token, process.env.PRIVATE_KEY);
  return verified.exp > Date.now();
}

/**
 * Function to check if the provided DOB is
 * 1.of valid format and 2.a valid date
 * @param {string} dateString - The user's DOB as a string
 * @returns true if the date is valid, else false
 */
function isValidDate(dateString) {
  const dateRegExp = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(dateRegExp)) return false; // Invalid format
  let date = new Date(dateString);
  let dateNum = date.getTime();
  if (!dateNum && dateNum !== 0) return false; // Invalid date
  return date.toISOString().slice(0,10) === dateString;
};

// Handle the registration of a user at the /register route
router.post('/register', function(req, res, next) {
  // Check if both email and password have been sent
  if (!req.body.email || !req.body.password) {
    res.status(400).json({error: true, message: 'Request body incomplete, both email and password are required.'});
  } else {
    const user = {
      'email': req.body.email,
      'password': req.body.password
    }

    // Enter the user into the database
    req.db('users').insert(user)
    .then(_ => {
      res.status(201).json({ message: 'User created.'});
    })
    // Let the user know if such a profile already exists
    .catch(err => {
      console.error(err);
      res.status(409).json({error: true, message: 'User already exists.'});
    })
  }
});

// Authenticate and log the user in at the /login route
router.post('/login', function(req, res, next) {
  // Check if both email and password have been sent
  if (!req.body.email || !req.body.password) {
    res.status(400).json({error: true, message: 'Request body incomplete, both email and password are required.'});
  } else {
    req.db.from('users').select('password').where('email', '=', req.body.email)
    .then(rows => {
      // Check if the email and password that have been sent are valid and already in the database after registration
      if (rows.length == 0 || !rows[0].password || rows[0].password !== req.body.password) {
        res.status(401).json({error: true, message: 'Incorrect email or password.'});
      } else {
        // Create token on successful login
        const generatedToken = jwt.sign({email: req.body.email, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)}, process.env.PRIVATE_KEY);
        
        const filter = {
          'email': req.body.email,
          'password': req.body.password
        };
        const token = {
          'token': generatedToken
        };

        let updateError = false;

        // Update the user with their token in the database
        req.db('users').where(filter).update(token)
        .catch(err => {
          console.error(err);
          console.log('Error when updating user token.');
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
      console.error(err);
      res.status(401).json({error: true, message: 'Incorrect email or password.'});
    })
  }
});

// Retrieve a user profile at the /{email}/profile route
router.get('/:email/profile', function(req, res, next) {
  req.db.from('users').select('email').where('email', '=', req.params.email)
  .then(rows => {
    // Check if such a profile exists in the database
    if (rows.length === 0) {
      res.status(404).json({error: true, message: 'User not found.'});
    }
    // Check if an authorization header has been sent and if it is malformed
    else if (req.headers.authorization && req.headers.authorization.substring(0, 'Bearer '.length) !== 'Bearer ') {
      res.status(401).json({error: true, message: 'Authorization header is malformed.'});
    } else {
      let authError = false;
      let authorised = false;

      if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ').pop();

        req.db.from('users').select('email').where('token', '=', token)
        .then(rows => {
          // Check if the token is a valid one that can be found in the database
          if (rows.length === 0) {
            res.status(401).json({error: true, message: 'Invalid JWT token.'});
            authError = true;
          }
          // Check if the email matching the token is the email being requested
          else if (rows[0].email === req.params.email) {
            authorised = true;
          }
          // Check if the token has expired
          else if (isExpiredToken(token)) {
            res.status(401).json({error: true, message: 'JWT token has expired.'});
            authError = true;
          }
        })
        .catch(err => {
          console.error(err);
          console.log('Error in MySQL query when checking if email exists.');
        })
      }

      if (!authError) {
        // Retrieve the profile information for the requested email from the database
        req.db.from('users').select('email', 'firstName', 'lastName', 'dob', 'address').where('email', '=', req.params.email)
        .then (rows => {
          let user = {
            email: rows[0].email,
            firstName: rows[0].firstName,
            lastName: rows[0].lastName
          }
          
          // Only include the additional authenticated information if authentication is successful
          if (authorised) {
            if (rows[0].dob) {
              rows[0].dob = new Date(rows[0].dob.toString());
              rows[0].dob.setDate(rows[0].dob.getDate() + 1);
              rows[0].dob = rows[0].dob.toISOString().slice(0, 10);
            }
            user.dob = rows[0].dob;
            user.address = rows[0].address;
          }
          
          res.status(200).json(user);
        })
        .catch(err => {
          console.error(err);
          console.log('Error in MySQL query when retrieving user profile.');
        })
      }
    }
  })
  .catch(err => {
    console.error(err);
    console.log('Error in MySQL query when checking if token exists.');
  })
});

// Update a user profile at the /{email}/profile route
router.put('/:email/profile', function(req, res, next) {
  // Check if authorization headers have been sent
  if (!req.headers.authorization) {
    res.status(401).json({error: true, message: "Authorization header ('Bearer token') not found."});
  }
  // Check if authorization header is malformed
  else if (req.headers.authorization.substring(0, 'Bearer '.length) !== 'Bearer ') {
    res.status(401).json({error: true, message: 'Authorization header is malformed.'});
  } else {
    const token = req.headers.authorization.split(' ').pop();

    req.db.from('users').select('email').where('token', '=', token)
    .then(rows => {
      // Check if such a token and therefore such a profile exists in the database
      if (rows.length !== 1) {
        res.status(401).json({error: true, message: 'Invalid JWT token.'});
      }
      // Check if the authenticated user is trying to update another users profile
      else if (rows[0].email !== req.params.email) {
        res.status(403).json({error: true, message: 'Forbidden.'});
      }
      // Check if the users token has expired
      else if (isExpiredToken(token)) {
          res.status(401).json({error: true, message: 'JWT token has expired'});
      } else {
        // Check if the request body contains all necessary filds
        if (!(req.body.email || req.body.firstName || req.body.lastName || req.body.dob || req.body.address)) {
          res.status(400).json({error: true, message: 'Request body incomplete: firstName, lastName, dob and address are required.'});
        }
        // Check if the first name, last name and address are of valid format
        else if (typeof req.body.firstName !== 'string' ||
                   typeof req.body.lastName !== 'string' ||
                   typeof req.body.address !== 'string') {
          res.status(400).json({error: true, message: 'Request body invalid, firstName, lastName and address must be strings only.'});
        }
        // Check if the provided DOB is of valid format and a valid date
        else if (!isValidDate(req.body.dob)) {
          res.status(400).json({error: true, message: 'Invalid input: dob must be a real date in format YYYY-MM-DD.'});
        }
        // Check if the provided DOB is a date in the past
        else if (Date.parse(req.body.dob) >= Date.now()) {
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
          };

          // Retrieve the update profile information from the database
          req.db('users').where(filter).update(user)
          .then(_ => {
            req.db.from('users').select('email', 'firstName', 'lastName', 'dob', 'address').where('email', '=', req.params.email)
            .then(rows => {
              if (rows[0].dob) {
                rows[0].dob = new Date(rows[0].dob.toString());
                rows[0].dob.setDate(rows[0].dob.getDate() + 1);
                rows[0].dob = rows[0].dob.toISOString().slice(0, 10);
              }
              return rows;
            })
            .then(rows => {
              res.status(200).json({
                email: rows[0].email,
                firstName: rows[0].firstName,
                lastName: rows[0].lastName,
                dob: rows[0].dob,
                address: rows[0].address
              });
            })
            .catch(err => {
              console.error(err);
              console.log('Error in MySQL query when retrieving updated user profile.');
            });
          })
          .catch(err => {
            console.error(err);
            console.log('Error in MySQL query when updating user profile.');
          });
        }
      }
    })
    .catch(err => {
      console.error(err);
      console.log('Error in MySQL query when checking if token exists.');
    });
  }
});

module.exports = router;
