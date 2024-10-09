const { append } = require("express/lib/response");
const db = require("../config/database");
const mysql2 = require("mysql2")

const return1 = (keyword, sortBy) => {
  const wildcardKeyword = `%${keyword}%`;

  let queryStringSearch1 = "SELECT * FROM University \
                            WHERE name LIKE ? \
                            OR location LIKE ? \
                            OR sport LIKE ? \
                            OR medals LIKE ? \
                            OR notable_athletes LIKE ? \
                            OR academia_rating LIKE ?";

  const params = [wildcardKeyword, wildcardKeyword, wildcardKeyword, wildcardKeyword, wildcardKeyword, wildcardKeyword];

  if (sortBy) {
    if (sortBy == "academia_rating"){
      queryStringSearch1 += " ORDER BY " + sortBy + " DESC"; // dynamically add the ORDER BY clause
    } else {
      queryStringSearch1 += " ORDER BY " + sortBy; // dynamically add the ORDER BY clause
    }
  }
  
  return new Promise(function(resolve, reject) {
    db.query(queryStringSearch1, params, function (error, results, fields) {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

// endpoint uni-specific search: uni_name, keyword, triggered when user supplies dropdown selection
const return2 = (keyword, dropDownSel, sortBy) => {
  const wildcardKeyword = `%${keyword}%`;
  const wildcardKeyword2 = `%${dropDownSel}%`;
  let queryStringSearch2 = "SELECT * FROM University \
                            WHERE sport LIKE ? \
                            AND (location LIKE ? \
                            OR name LIKE ?\
                            OR medals LIKE ? \
                            OR notable_athletes LIKE ? \
                            OR academia_rating LIKE ?)";

  const params = [wildcardKeyword2, wildcardKeyword, wildcardKeyword, wildcardKeyword, wildcardKeyword, wildcardKeyword];

  if (sortBy) {
    queryStringSearch2 += " ORDER BY " + sortBy; // dynamically add the ORDER BY clause
  }

  return new Promise(function(resolve, reject) {
    db.query(queryStringSearch2, params, function (error, results, fields) {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

//
const universityCoords = (keyword, sortBy) => {
  const wildcardKeyword = `%${keyword}%`;
  let query = `SELECT university_id, name, latitude, longitude FROM University WHERE name LIKE ?`;

  if (sortBy) {
    query += " ORDER BY " + sortBy; // dynamically add the ORDER BY clause
  }

  return new Promise((resolve, reject) => {
    db.query(query, [wildcardKeyword], (error, results) => {
      if (error) {
        reject(error);
      }

      resolve(results);
    });
  });
};

module.exports = {return1, return2, universityCoords}
