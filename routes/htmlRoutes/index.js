const path = require('path');
// start an instance of Router
const router = require('express').Router();

// a route that has the term api in it will deal in transference of JSON data,
// a more normal-looking endpoint such as /animals should serve an HTML page
router.get('/', (req, res) => { // used to be app.get
    // we use sendFile when sending an HTML page to browser
    // __dirname, which represents the directory of the file we execute the code in '/'
    // with the path of where to find the index.html file
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

router.get('/animals', (req, res) => { // used to be app.get
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});


router.get('/zookeepers', (req, res) => { // used to be app.get
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

// in case a user requests a non-existent path
// * is a wildcard, meaning any route that wasn't previously defined will fall
// under this request and will receive the homepage as the response
// in order of routes, * should always come last!!!!
router.get('*', (req, res) => { // used to be app.get
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports = router;