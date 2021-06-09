var express = require('express');
var router = express.Router();
var swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
var jwt = require('jsonwebtoken');

const years = ['2020', '2019', '2018', '2017', '2016', '2015']
const letters = /^[A-Za-z ]+$/;
const numbers = /^\d+$/;

/* GET home page. */
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument));

router.get('/rankings', function(req, res, next) {
  const {year, country, ...remaining} = req.query;

  if (Object.keys(remaining).length !== 0) {
    res.status(400).json({error: true, message: "Invalid query parameters. Only year and country are permitted."});
  } else {
      let yearQuery, countryQuery = false;
      let queryError = false;

      if (year) {
        yearQuery = true;
        if (!years.includes(year)) {
          res.status(400).json({error: true, message: "Invalid year format. Format must be yyyy."});
          queryError = true;
        }
      }

      if (!queryError) {
        if (country) {
          countryQuery = true;
          if (!country.match(letters)) {
            res.status(400).json({error: true, message: "Invalid country format. Country query parameter cannot contain numbers."});
            queryError = true;
          }
        }
      }

      if (!queryError) {
        if (yearQuery && countryQuery) {
          req.db.from('rankings')
                .select("rank", "country", "score", "year").where('country', '=', country).where('year', '=', year).orderBy('year', 'desc')
          .then((rows) => {
            res.json(rows)
          })
          .catch((err) => {
            console.log(err);
            res.json({"Error" : true, "Message" : "Error in MySQL query"})
          })
        } else if (yearQuery) {
          req.db.from('rankings').select("rank", "country", "score", "year").where('year', '=', year).orderBy('year', 'desc')
          .then((rows) => {
            res.json(rows)
          })
          .catch((err) => {
            console.log(err);
            res.json({"Error" : true, "Message" : "Error in MySQL query"})
          })
        } else if (countryQuery) {
          req.db.from('rankings').select("rank", "country", "score", "year").where('country', '=', country).orderBy('year', 'desc')
          .then((rows) => {
            res.json(rows)
          })
          .catch((err) => {
            console.log(err);
            res.json({"Error" : true, "Message" : "Error in MySQL query"})
          })
        } else {
          req.db.from('rankings').select("rank", "country", "score", "year").orderBy('year', 'desc')
          .then((rows) => {
            res.status(200).json(rows);
          })
          .catch((err) => {
            res.json({error: true, message: "Error in MySQL query when retrieving rankings without queries."})
          })
        }
      }
    }
});

router.get('/factors/:year', function(req, res, next) {
  if (!req.headers.authorization) {
    res.status(401).json({error: true, message: "Authorization header ('Bearer token') not found"});
  } else if (req.headers.authorization.substring(0, 'Bearer '.length) !== 'Bearer ') {
    res.status(401).json({error: true, message: "Authorization header is malformed"});
  } else {
    if (req.params.year.length !== 4 || !req.params.year.match(numbers)) {
      res.status(400).json({error: true, message: "Invalid year format. Format must be yyyy."});
    }
    else {
      const token = req.headers.authorization.split(' ').pop();
      
      req.db.from('users').select("email").where('token', '=', token)
      .then(rows => {
        if (rows.length !== 1) {
          res.status(401).json({error: true, message: "Invalid JWT token"});
        } else {
          const verified = jwt.verify(token, process.env.PRIVATE_KEY);

          if (verified.exp > Date.now()) {
            res.status(401).json({error: true, message: "JWT token has expired."})
          } else {
            req.db.from('rankings')
            .select("rank", "country", "score", "economy", "family", "health", "freedom", "generosity", "trust")
            .where('year', '=', req.params.year).orderBy('year', 'desc')
            .then((rows) => {
              res.json(rows)
            })
            .catch((err) => {
              res.json({error: true, message: "Error in MySQL query when retrieving factors."})
            })
          }
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({"Error" : true, "Message" : "Error in MySQL query when checking token."})
      })
    }
  }
});

router.get('/countries', function(req, res, next) {
  const {...queries} = req.query;

  if (Object.keys(queries).length !== 0) {
    res.status(400).json({error: true, message: "Invalid query parameters. Query parameters are not permitted."});
  } else {
    req.db.from('rankings').select("country").distinct('country').orderBy('country')
    .then((rows) => {
      res.json(rows.map(row => row.country))
    })
    .catch((err) => {
      console.log(err);
      res.json({error: true, message: "Error in MySQL query when retrieving countries."})
  })
  }
});

module.exports = router;
