// we're using apiRoutes/index.js as a central hub for all routing functions we may want to add to the application

const router = require('express').Router();
// Here we're employing Router as before, but this time we're having it use the module exported from animalRoutes.js. (Note that the .js extension is implied when supplying file names in require()).
const animalRoutes = require('../apiRoutes/animalRoutes');
const zookeeperRoutes = require('../apiRoutes/zookeeperRoutes');


router.use(animalRoutes);
router.use(zookeeperRoutes);

module.exports = router;