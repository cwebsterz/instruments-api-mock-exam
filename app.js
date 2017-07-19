require('dotenv').config()

const express = require('express')
const app = express()
const dal = require('./dal.js')
const port = process.env.PORT || 4000
const { pathOr, keys } = require('ramda')
const HTTPError = require('node-http-error')

const bodyParser = require('body-parser')

const checkRequiredFields = require('./lib/check-reqd-fields')
const checkInstReqdFields = checkRequiredFields(['category', 'name'])

app.use(bodyParser.json())

app.get('/', function(req, res, next) {
  res.send('Welcome to the Instruments API.')
})

////////////////////////////////
// CREATE -  POST /instruments//
////////////////////////////////

app.post('/instruments', function(req, res, next) {
  const inst = pathOr(null, ['body'], req)
  const checkResults = checkInstReqdFields(inst)

  if (checkResults.length > 0) {
    return next(
      new HTTPError(400, 'Bad request, missing required fields: ', {
        fields: checkResults
      })
    )
  }

  dal.createInstrument(inst, function(err, result) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(201).send(result)
  })
})

///////////////////////////////////
// READ   -  GET /instruments/:id//
///////////////////////////////////

app.get('/instruments/:id', function(req, res, next) {
  const instId = pathOr(null, ['params', 'id'], req)
  dal.getInstrument(instId, function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    if (instId) {
      res.status(200).send(data)
    } else {
      return next(new HTTPError(400, 'Missing id in path'))
    }
  })
})

///////////////////////////////////
// UPDATE -  PUT /instruments/:id//
///////////////////////////////////

app.put('/instruments/:id', function(req, res, next) {
  const instId = pathOr(null, ['params', 'id'], req)
  const body = pathOr(null, ['body'], req)
  const checkResults = checkInstReqdFields(body)

  if (checkResults.length > 0) {
    return next(
      new HTTPError(400, 'Bad request, missing required fields: ', {
        fields: checkResults
      })
    )
  }

  if (!body || keys(body).length === 0)
    return next(new HTTPError(400, 'Missing instrument in request body.'))

  dal.updateInstrument(body, function(err, response) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(response)
  })
})

//////////////////////////////////////
// DELETE -  DELETE /instruments/:id//
//////////////////////////////////////

app.delete('/instruments/:id', function(req, res, next) {
  const instId = pathOr(null, ['params', 'id'], req)

  dal.deleteInstrument(instId, function(err, result) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(result)
  })
})

///////////////////////////////
// LIST -    GET /instruments//
///////////////////////////////

app.get('/instruments', function(req, res, next) {
  const filter = pathOr(null, ['query', 'filter'], req)
  const limit = pathOr(20, ['query', 'limit'], req)
  const lastItem = pathOr(null, ['query', 'lastItem'], req)

  dal.listInstruments(lastItem, filter, Number(limit), function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(data)
  })
})

////Error Handling Function////
app.use(function(err, req, res, next) {
  console.log(req.method, req.path, err)
  res.status(err.status || 500)
  res.send(err)
})

app.listen(port, () => console.log('API Running on port:', port))
