# Musical Instruments API

This API manages instruments, their names, prices, categories, and types.

## Getting Started

First, you'll need to login to your Github account and fork this repo:

```
https://github.com/cwebsterz/instruments-api-mock-exam
```

Then, clone the fork locally and install the dependencies. Follow these steps:

```
$ git clone <your-forked-url>
$ cd instruments-api-mock-exam
$ npm install
```

## Setting up your Environment

Go to the **.env** file and modify the following environment variables:

- `COUCHDB_URL`
- `COUCHDB_NAME`

Here is an example of a value for the `COUCHDB_URL` environment variable for an instance of CouchDB within Cloudant.

```
COUCHDB_URL=https://<DB KEY>:<SECRET>@<BASE URL TO CLOUDANT.com/
```

## Loading Data & Indexes

There are two commands you'll need to run to load your data and your indexes; they're pretty straightforward.

```
$ npm run load
$ npm run loadIndex
```

## Starting Up

After you've done all those steps, run `npm start` and fire it up! It's going to default to port 4000. Enjoy!

## Endpoints

#### POST /instruments
Using a `POST` you can create a new Instrument item in the database. `Category` and `Name` are the only required inputs in this case, but you will probably want to add more detail than that. An example input could be:

```
{
  name: 'Cello Platinum',
  type: 'instrument',
  category: 'cello',
  group: 'strings',
  retailPrice: 600,
  manufacturer: 'Strings, Inc.'
}
```

#### GET /instruments/:id
This will allow you to  look up a single item by it's `_id` property. For example:

`GET` - `localhost:4000/instruments/instrument_piccolo_piccolo_bach`

Returns:

```
{
  _id: 'instrument_piccolo_piccolo_bach',
  name: 'Piccolo Bach',
  type: 'instrument',
  category: 'piccolo',
  group: 'winds',
  retailPrice: 300,
  manufacturer: 'Symphonic, Inc.'
}
```

#### PUT /instruments/:id
This will allow you to update an item in the database. You'll need the data that you want to update and the `_id`.

Example request:

`PUT` - `localhost:4000/instruments/instrument_piccolo_piccolo_bach`

Example body:

```
{
  _id: 'instrument_piccolo_piccolo_bach',
  name: 'Piccolo Bach',
  type: 'instrument',
  category: 'piccolo',
  group: 'winds',
  retailPrice: 300,
  manufacturer: 'Symphonic, Inc.'
}
```
Change the values to whatever you want and then send your request.

#### DELETE /instruments/:id
This one is pretty straightforward. Simply put the `_id` you want to delete into your request and send it.

Example request:
`DELETE` - `localhost:4000/instruments/instrument_piccolo_piccolo_bach`


#### GET /instruments
Using a `GET` to `localhost:4000/instruments` will display all of the Instrument items in the database.
