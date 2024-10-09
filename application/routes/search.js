const path = require("path");
const express = require('express');
const router = express.Router();
const Searches = require("../js/search");

const db = require("../config/database");

// Define your routes using the router instance
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../html/podium_scholars.html'));
});

router.post('/', async (req, res) => {
    //get search input from request
    let searchTerm = req.body.searchTerm;
    let sportSelection = req.body.sportSelection;
    let sortSelection = req.body.sortSelection;
  
    if (sportSelection == '') {  //'' if no drop down selection
      //returns a promise, sends response back to client
      const returnObject = await Searches.return1(searchTerm, sortSelection).then((res) => { return res });
  
      res.send(returnObject);
    } else {
      //triggered if drop down selection in html
      const returnObject2 = await Searches.return2(searchTerm, sportSelection, sortSelection).then((res) => { return res });
      res.send(returnObject2);
    }
  });

module.exports = router;