// lib version of animals.js!!
// these dependencies were declared in server.js and we need to do so again here since we've moved these functions
const fs = require("fs");
const path = require("path");

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
        path.join(__dirname, '../data/animals.json'), // we are one directory below data folder
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

  // we have to export these now for use elsewhere
  module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
  };
  

