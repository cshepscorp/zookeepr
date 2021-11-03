const fs = require('fs');
const path = require('path'); // path provides utilities for working with file and directory paths

// create a route that the front-end can request data from
const { animals } = require('./data/animals'); // whenever we use require() to import data or functionality, it's only reading the data and creating a copy of it to use in server.js (or the current file you're requiring file to)

const express = require('express');
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

// instead of handling the filter functionality inside the .get() callback, we're going to break it out into its own function
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // Save personalityTraits as a dedicated array.
        // If personalityTraits is a string, place it into a new array and save.
        if (typeof query.personalityTraits === 'string') {
        personalityTraitsArray = [query.personalityTraits];
        } else {
        personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
        // Check the trait against each animal in the filteredResults array.
        // Remember, it is initially a copy of the animalsArray,
        // but here we're updating it for each trait in the .forEach() loop.
        // For each trait being targeted by the filter, the filteredResults
        // array will then contain only the entries that contain the trait,
        // so at the end we'll have an array of animals that have every one 
        // of the traits when the .forEach() loop is finished.
        filteredResults = filteredResults.filter(
            animal => animal.personalityTraits.indexOf(trait) !== -1
        );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
    filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}


// this function accepts the POST route's req.body value and the array we want to add the data to

function createNewAnimal(body, animalsArray) {
    // console.log(body);
    // when we POST a new animal, we'll add it to the imported animals array from the animals.json file
    const animal = body;
    // We'll have to not only use .push() to save the new data in this local server.js copy of our animal data (referenced in const animal required above), but we'll also have to import and use the fs library to write that data to animals.json.
    animalsArray.push(animal);

    // fs.writeFileSync() method is the synchronous version of fs.writeFile() and doesn't require a callback function;
    // we use path.join() to join the value of __dirname, which represents the directory of the file we execute the code in, with the path to the animals.json file
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        // The null argument means we don't want to edit any of our existing data
        // 2 indicates we want to create white space between our values to make it more readable
        JSON.stringify({ animals: animalsArray }, null, 2) 
        
    );
    
    // return finished code to post route for response
    return animal;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') { // if no animal name or it's not a string
      return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
      return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
      return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
      return false;
    }
    return true;
  }

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

/*
Now we just need to use one method to make our server listen. We're going to chain the listen() method onto our server to do it
*/
app.listen(PORT, () => { // PORT value matches up with const PORT we set at start of file determined by Heroku
    console.log(`API server now on port ${PORT}!`);
  });