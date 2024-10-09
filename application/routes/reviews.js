const path = require("path");
const express = require('express');
const app = express();
const router = express.Router();
const fs = require('node:fs');

const db = require("../config/database");
const logInCheck = require("../middleware/routeProtectors");
const res = require("express/lib/response");

/* GET users listing. */
router.get('/', function (req, res, next){
    res.send('respond with a resource');
});

router.get('/reviewPage/:cid/:name', (req, res) => {
  // Read the html file into a string variable
  fs.readFile(path.join(__dirname, '../html/reviewPage.html'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }   
    data = data.replace("{COLLEGE}", req.params.name)
    data = data.replace("{CID}", req.params.cid);
    res.send(data);
  });
});

router.get('/:cid', (req, res) => {
    //can do search for reviews here as its rendered
    //pass data into template
    let sql = "SELECT * FROM Reviews WHERE reviews_university_id = ?;"
    db.query(sql, [req.params.cid], (err, res1) => {
        //return res.send json response
      if (err) throw err;
      console.log(res1);
      res.json(res1);
    });
  })

  router.post('/postReview', logInCheck.isLoggedIn, (req, res) => {
    let userId = req.session.userId; // Assuming this gets the user ID
    let review = req.body.reviewText; 
    let rating = req.body.rating; 
    let universityId = req.body.university_id; 

    // SQL query to insert the review
    let sql = "INSERT INTO Reviews(reviews_university_id, reviews_user_id, review, rating) \
                VALUES (?, ?, ?, ?);";

    // calculate average score and place inside university academia_rating column for university
    db.query(sql, [universityId, userId, review, rating], (err, result) => {
        if (err) {
            console.error("Error inserting review:", err);
            res.status(500).send("Error inserting review");
        } else {
          let sql = "UPDATE University \
                      SET academia_rating = (SELECT AVG(rating) FROM Reviews) WHERE universityId = ?";

            db.execute(sql, [universityId], (err, result) => {
              console.log(req.session);
              res.redirect("/search");
            });
        }
    });
});

module.exports = router;
