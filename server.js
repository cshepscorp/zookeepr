// the function of this file is to start the server 💡

const fs = require('fs');
const path = require('path'); // path provides utilities for working with file and directory paths
const express = require('express');
// create a route that the front-end can request data from
const { animals } = require('./data/animals'); // whenever we use require() to import data or functionality, it's only reading the data and creating a copy of it to use in server.js (or the current file you're requiring file to)


const PORT = process.env.PORT || 3001;

const app = express(); // instantiate the server
/* app.use() method. This is a method executed by our Express.js server that mounts a function to the server that our requests will pass through before getting to the intended endpoint. The functions we can mount to our server are referred to as middleware. */
/* In order for our server to accept incoming data the way we need it to, we need to tell our Express.js app to intercept our POST request before it gets to the callback function. At that point, the data will be run through a couple of functions to take the raw data transferred over HTTP and convert it to a JSON object. */
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// a method built into Express.js. It takes incoming POST data and converts it to key/value pairings that can be accessed in the req.body object
// extended: true option set inside the method call informs our server that there may be sub-array data nested in it as well, so it needs to look as deep into the POST data as possible to parse all of the data correctly

// parse incoming JSON data
// this method we used takes incoming POST data in the form of JSON and parses it into the req.body JavaScript object. Both of the above middleware functions need to be set up every time you create a server that's looking to accept POST data.
app.use(express.json());

// here, we're telling express to reference these files for use
// .html pages, stylesheets, JavaScript and images
// with express.static, we provide a file path to a location in our app (the public folder)
// and instruct the server to make these files static resources
// no need to create a specific server endpoint created for it!
// Every time we create a server that will serve a front end as well as JSON data,
// we'll want to use this middleware
app.use(express.static('public'));

// filterByQuery(), findById(), createNewAnimal(), and validateAnimal() used to be located here
// now moved to lib/animals.js

// route that the front-end can request data from
/* the get() method requires two arguments. 
1. a string that describes the route the client will have to fetch from. 
2. a callback function that will execute every time that route is accessed with a GET request. */
app.get('/api/animals', (req, res) => {
    let results = animals;
    // accessing the query property on the req object
    //console.log(req.query);
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results); // res parameter (short for response)
  });

  // Unlike the query object, the param object needs to be defined in the route path
// this route should only return a single animal, because the id is unique. We also know that there won't be any query on a single animal, so there's no need for all of the other code.
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        //res.sendStatus(404);
        res.status(400).send('This is not a valid animal id.');
    }
});

// this is just another method of the app object that allows us to create routes
// POST requests differ from GET requests in that they represent the action of a client requesting the server to accept data rather than vice versa
app.post('/api/animals', (req, res) => {
    // With POST requests, we can package up data, typically as an object, and send it to the server
    // req.body property is where we can access that data on the server side and do something with it
    // req.body is where our incoming content will be
    /* we're simply using console.log() to view the data we're posting to the server and then using res.json() to send the data back to the client. This isn't what we'll typically do with a POST request, but when creating and testing new routes, it's the fastest way to ensure that the data sent from the client gets to the endpoint correctly. */
    // console.log(req.body);
    // res.json(req.body);
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString(); // take the length property of the animals array (because it's a one-to-one representation of our animals.json file data) and set that as the id for the new data;
    // .length is always going to be one number ahead of the last index of the array
    // add animal to json file and animals array in this function
    if (!validateAnimal(req.body)){
        res.status(400).send('The animal is not properly formatted.')
        // a response method to relay a message to the client making the request. We send them an HTTP status code and a message explaining what went wrong. Anything in the 400 range means that it's a user error and not a server error
    } else {
        const animal = createNewAnimal(req.body, animals); // send the updated req.body data to createNewAnimal()
        res.json(animal);
    }
    // createNewAnimal(); // takes the new animal data and adds it to the animalsArray we passed, and then write the new array data to animals.json; After saving it, we'll send the data back to the route's callback function so it can finally respond to the request
});

// a route that has the term api in it will deal in transference of JSON data,
// a more normal-looking endpoint such as /animals should serve an HTML page
app.get('/', (req, res) => {
    // we use sendFile when sending an HTML page to browser
    // __dirname, which represents the directory of the file we execute the code in '/'
    // with the path of where to find the index.html file
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// in case a user requests a non-existent path
// * is a wildcard, meaning any route that wasn't previously defined will fall
// under this request and will receive the homepage as the response
// in order of routes, * should always come last!!!!
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

/*
Now we just need to use one method to make our server listen. We're going to chain the listen() method onto our server to do it
*/
app.listen(PORT, () => { // PORT value matches up with const PORT we set at start of file determined by Heroku
    console.log(`API server now on port ${PORT}!`);
  });