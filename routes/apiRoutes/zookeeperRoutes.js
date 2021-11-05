// start an instance of Router
const router = require('express').Router();
// in order to use these finctions we need to import them from our new /lib/animals file
const { filterByQuery, findById, createNewZookeeper, validateZookeeper, } = require('../../lib/zookeepers');
// '../../' takes us up two dirs
const { zookeepers } = require('../../data/zookeepers');

// Router allows you to declare routes in any file as long as you use the proper middleware
// we're now going to change all of the app routes to user router instead!

// route that the front-end can request data from
/* the get() method requires two arguments. 
1. a string that describes the route the client will have to fetch from. 
2. a callback function that will execute every time that route is accessed with a GET request. */

router.get('/zookeepers', (req, res) => { // used to be app.get
    let results = zookeepers;
    // accessing the query property on the req object
    //console.log(req.query);
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results); // res parameter (short for response)
  });

  // Unlike the query object, the param object needs to be defined in the route path
// this route should only return a single animal, because the id is unique. We also know that there won't be any query on a single animal, so there's no need for all of the other code.
router.get('/zookeepers/:id', (req, res) => { // used to be app.get
    const result = findById(req.params.id, zookeepers);
    if (result) {
        res.json(result);
    } else {
        //res.sendStatus(404);
        res.send(404);
    }
});

// this is just another method of the app object that allows us to create routes
// POST requests differ from GET requests in that they represent the action of a client requesting the server to accept data rather than vice versa
router.post('/zookeepers', (req, res) => { // used to be app.post
    // With POST requests, we can package up data, typically as an object, and send it to the server
    // req.body property is where we can access that data on the server side and do something with it
    // req.body is where our incoming content will be
    /* we're simply using console.log() to view the data we're posting to the server and then using res.json() to send the data back to the client. This isn't what we'll typically do with a POST request, but when creating and testing new routes, it's the fastest way to ensure that the data sent from the client gets to the endpoint correctly. */
    // console.log(req.body);
    // res.json(req.body);
    // set id based on what the next index of the array will be
    req.body.id = zookeepers.length.toString(); // take the length property of the animals array (because it's a one-to-one representation of our animals.json file data) and set that as the id for the new data;
    // .length is always going to be one number ahead of the last index of the array
    // add animal to json file and animals array in this function
    if (!validateZookeeper(req.body)){
        res.status(400).send('The zookeeper is not properly formatted.')
        // a response method to relay a message to the client making the request. We send them an HTTP status code and a message explaining what went wrong. Anything in the 400 range means that it's a user error and not a server error
    } else {
        const zookeeper = createNewZookeeper(req.body, zookeepers); // send the updated req.body data to createNewAnimal()
        res.json(zookeeper);
    }
    // createNewAnimal(); // takes the new animal data and adds it to the animalsArray we passed, and then write the new array data to animals.json; After saving it, we'll send the data back to the route's callback function so it can finally respond to the request
});

module.exports = router;