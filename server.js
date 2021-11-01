// create a route that the front-end can request data from
const { animals } = require('./data/animals');

const express = require('express');
const app = express(); // instantiate the server

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
/*
Now we just need to use one method to make our server listen. We're going to chain the listen() method onto our server to do it. To do that, add the following code to the end of server.js
*/
app.listen(3001, () => {
    console.log(`API server now on port 3001!`);
  });