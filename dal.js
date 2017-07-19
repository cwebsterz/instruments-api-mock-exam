const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))
const db = new PouchDB(process.env.COUCHDB_URL + process.env.COUCHDB_NAME)
const { assoc, split, head, last } = require('ramda')

const bldPrimaryKey = require('./lib/bld-primary-key')
const instPKGenerator = bldPrimaryKey('instrument_')

//////////////
////CREATE////
//////////////

function createInstrument(inst, callback) {
  console.log('dal create: ', inst)
  const pk = instPKGenerator(inst.category + '_' + inst.name)
  console.log('pk: ', pk)
  inst = assoc('_id', pk, inst)
  inst = assoc('type', 'instrument', inst)
  console.log('modified: ', inst)
  createDoc(inst, callback)
}

////////////
////READ////
////////////

function getInstrument(instId, callback) {
  db.get(instId, function(err, doc) {
    if (err) return callback(err)

    doc.type === 'instrument'
      ? callback(null, doc)
      : callback(new HTTPError(400, 'Bad request, ID must be a medication'))
  })
}

//////////////
////UPDATE////
//////////////

function updateInstrument(inst, callback) {
  pat = assoc('type', 'instrument', inst)
  db.put(inst, function(err, doc) {
    if (err) callback(err)
    callback(null, doc)
  })
}

//////////////
////DELETE////
//////////////

function deleteInstrument(instId, callback) {
  db
    .get(instId)
    .then(function(doc) {
      return db.remove(doc)
    })
    .then(function(result) {
      callback(null, result)
    })
    .catch(function(err) {
      callback(err)
    })
}

////////////
////LIST////
////////////

function listInstruments(lastItem, instFilter, limit, callback) {
  var query = {}
  if (instFilter) {
    const arrFilter = split(':', instFilter)
    const filterField = head(arrFilter)
    const filterValue = last(arrFilter)
    const selectorValue = assoc(filterField, filterValue, {})

    query = { selector: selectorValue, limit }
  } else if (lastItem) {
    query = { selector: { _id: { $gt: lastItem }, type: 'instrument' }, limit }
  } else {
    query = { selector: { _id: { $gte: null }, type: 'instrument' }, limit }
  }

  findInst(query, function(err, data) {
    if (err) return callback(err)
    callback(null, data.docs)
  })
}

/////////////////
////Helper(s)////
/////////////////

function findInst(query, cb) {
  console.log('query', JSON.stringify(query, null, 2))
  query ? db.find(query, cb) : cb(null, [])
}

const dal = {
  createInstrument,
  getInstrument,
  updateInstrument,
  deleteInstrument,
  listInstruments
}

module.exports = dal
