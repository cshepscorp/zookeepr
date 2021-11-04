// the function of this file is to start the server 💡

//const fs = require('fs');
//const path = require('path'); // path provides utilities for working with file and directory paths
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express(); // instantiate the server
// The require() statements will read the index.js files in each of the directories indicated
// with require(), the index.js file will be the default file read if no other file is provided, which is the coding method we're using here.
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// create a route that the front-end can request data from
// const { animals } = require('./data/animals'); // whenever we use require() to import data or functionality, it's only reading the data and creating a copy of it to use in server.js (or the current file you're requiring file to)

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

// This is our way of telling the server that any time a client navigates to <ourhost>/api, the app will use the router we set up in apiRoutes. If / is the endpoint, then the router will serve back our HTML routes.
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// filterByQuery(), findById(), createNewAnimal(), and validateAnimal() used to be located here
// now moved to lib/animals.js

// all animal routes used to be here
// ie. app.get('/api/animals'), etc
// app.post method was also here

// app.get etc for html files were here

/*
Now we just need to use one method to make our server listen. We're going to chain the listen() method onto our server to do it
*/
app.listen(PORT, () => { // PORT value matches up with const PORT we set at start of file determined by Heroku
    console.log(`API server now on port ${PORT}!`);
  });