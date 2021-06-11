var express = require('express');
var router = express.Router();
var swaggerUi = require('swagger-ui-express');
var jwt = require('jsonwebtoken');

const swaggerDocument = require('../swagger.json');
const swaggerOptions = {
  swaggerOptions: { defaultModelsExpandDepth: -1 },
};
const letters = /[A-Za-z ]/;
const numbers = /\d/;

/**
 * Function to check if a users token has expired
 * @param {string} token - The user's bearer token
 * @returns true if token is expired, else false
 */
function isExpiredToken(token) {
  const verified = jwt.verify(token, process.env.PRIVATE_KEY);
  return verified.exp > Date.now();
}

// Serve the swagger documentation at the index (homepage)
router.use('/', swaggerUi.serve)
router.get('/', swaggerUi.setup(swaggerDocument, swaggerOptions));

// Serve the unauthenticated rankings at the /rankings route
router.get('/rankings', function(req, res, next) {
  const {year, country, ...remaining} = req.query;

  // Check if unnecessary queries have been sent
  if (Object.keys(remaining).length !== 0) {
    res.status(400).json({error: true, message: 'Invalid query parameters. Only year and country are permitted.'});
  } else {
      let yearQuery, countryQuery = false;
      let queryError = false;

      if (year) {
        yearQuery = true;
        // Check if any letters in the year query parameter
        if (year.match(letters)) {
          res.status(400).json({error: true, message: 'Invalid year format. Format must be yyyy.'});
          queryError = true;
        }
      }

      if (!queryError && country) {
        countryQuery = true;
        // Check if any numbers in the country query parameter
        if (country.match(numbers)) {
          res.status(400).json({error: true, message: 'Invalid country format. Country query parameter cannot contain numbers.'});
          queryError = true;
        }
      }

      if (!queryError) {
        // Retrieve rankings with year and country query
        if (yearQuery && countryQuery) {
          req.db.from('rankings')
                .select('rank', 'country', 'score', 'year').where('country', '=', country).where('year', '=', year).orderBy('year', 'desc')
          .then((rows) => {
            res.status(200).json(rows);
          })
          .catch((err) => {
            console.error(err);
            console.log('Error in MySQL query');
          })
        }

        // Retrieve rankings with year query only
        else if (yearQuery) {
          req.db.from('rankings').select('rank', 'country', 'score', 'year').where('year', '=', year).orderBy('year', 'desc')
          .then((rows) => {
            res.status(200).json(rows);
          })
          .catch((err) => {
            console.error(err);
            console.log('Error in MySQL query');
          })
        }

        // Retrieve rankings with country query only
        else if (countryQuery) {
          req.db.from('rankings').select('rank', 'country', 'score', 'year').where('country', '=', country).orderBy('year', 'desc')
          .then((rows) => {
            res.status(200).json(rows);
          })
          .catch((err) => {
            console.error(err);
            console.log('Error in MySQL query');
          })
        }
        
        // Retrieve all rankings
        else {
          req.db.from('rankings').select('rank', 'country', 'score', 'year').orderBy('year', 'desc')
          .then((rows) => {
            res.status(200).json(rows);
          })
          .catch((err) => {
            console.error(err);
            console.log('Error in MySQL query when retrieving rankings without queries.');
          })
        }
      }
    }
});

// Serve the authenticated factors at the /factors route
router.get('/factors/:year', function(req, res, next) {
  const {limit, country, ...remaining} = req.query;

  // Check if unnecessary queries have been sent
  if (Object.keys(remaining).length !== 0) {
    res.status(400).json({error: true, message: 'Invalid query parameters. Only limit and country are permitted.'});
  } else {

    // Check if authorization headers have been sent and that they contain a bearer token
    if (!req.headers.authorization) {
      res.status(401).json({error: true, message: "Authorization header ('Bearer token') not found"});
    }
    // Check if authorization header is malformed
    else if (req.headers.authorization.substring(0, 'Bearer '.length) !== 'Bearer ') {
      res.status(401).json({error: true, message: 'Authorization header is malformed'});
    } else {
      // Check for incorrect year format
      if (req.params.year.length !== 4 || !req.params.year.match(numbers)) {
        res.status(400).json({error: true, message: 'Invalid year format. Format must be yyyy.'});
      }
      else {
        const token = req.headers.authorization.split(' ').pop();

        req.db.from('users').select('email').where('token', '=', token)
        .then(rows => {
          // Check if the token is a valid one that can be found in the database
          if (rows.length !== 1) {
            res.status(401).json({error: true, message: 'Invalid JWT token'});
          }
          // Check if the token has expired
          else if (isExpiredToken(token)) {
              res.status(401).json({error: true, message: 'JWT token has expired.'});
          } else {
            let queryError = false;
            let limitQuery, countryQuery = false;

            if (country) {
              countryQuery = true;
              // Check if any numbers in the country query parameter
              if (country.match(numbers)) {
                res.status(400).json({error: true, message: 'Invalid country format. Country query parameter cannot contain numbers.'});
                queryError = true;
              }
            }

            if (!queryError && limit) {
              limitQuery = true;
              limitInt = parseInt(limit);
              // Check if the limit query is a positive integer
              if (parseFloat(limit)%limitInt !== 0 || limitInt <= 0) {
                res.status(400).json({error: true, message: 'Invalid limit query. Limit must be a positive number.'});
                queryError = true;
              }
            }

            if (!queryError) {

              // Retrieve factors with limit and country query for the requested year
              if (countryQuery && limitQuery) {
                req.db.from('rankings')
                .select('rank', 'country', 'score', 'economy', 'family', 'health', 'freedom', 'generosity', 'trust')
                .where('year', '=', req.params.year).where('country', '=', country).limit(limitInt).orderBy('year', 'desc')
                .then((rows) => {
                  res.status(200).json(rows);
                })
                .catch((err) => {
                  console.error(err);
                  console.log('Error in MySQL query when retrieving factors.');
                })
              }
              
              // Retrieve factors with country query only for the requested year
              else if (countryQuery) {
                req.db.from('rankings')
                .select('rank', 'country', 'score', 'economy', 'family', 'health', 'freedom', 'generosity', 'trust')
                .where('year', '=', req.params.year).where('country', '=', country).orderBy('year', 'desc')
                .then((rows) => {
                  res.status(200).json(rows);
                })
                .catch((err) => {
                  console.error(err);
                  console.log('Error in MySQL query when retrieving factors.');
                })
              }
              
              // Retrieve factors with limit query only for the requested year
              else if (limitQuery) {
                req.db.from('rankings')
                .select('rank', 'country', 'score', 'economy', 'family', 'health', 'freedom', 'generosity', 'trust')
                .where('year', '=', req.params.year).limit(limitInt).orderBy('year', 'desc')
                .then((rows) => {
                  res.status(200).json(rows);
                })
                .catch((err) => {
                  console.error(err);
                  console.log('Error in MySQL query when retrieving factors.');
                })
              }
              
              // Retrieve all factors for the requested year
              else {
                req.db.from('rankings')
                .select('rank', 'country', 'score', 'economy', 'family', 'health', 'freedom', 'generosity', 'trust')
                .where('year', '=', req.params.year).orderBy('year', 'desc')
                .then((rows) => {
                  res.status(200).json(rows);
                })
                .catch((err) => {
                  console.error(err);
                  console.log('Error in MySQL query when retrieving factors.');
                })
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
          console.log('Error in MySQL query when checking token.');
        })
      }
    }
  }
});

// Serve the unauthenticated countries at the /countries route
router.get('/countries', function(req, res, next) {
  const {...queries} = req.query;

  // Check if any queries have been sent
  if (Object.keys(queries).length !== 0) {
    res.status(400).json({error: true, message: 'Invalid query parameters. Query parameters are not permitted.'});
  } else {

    // Retrieve all countries from the database
    req.db.from('rankings').select('country').distinct('country').orderBy('country')
    .then((rows) => {
      res.status(200).json(rows.map(row => row.country));
    })
    .catch((err) => {
      console.error(err);
      console.log('Error in MySQL query when retrieving countries.');
  })
  }
});

module.exports = router;
