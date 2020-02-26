var express = require('express');
var router = express.Router();
var template = require('../template/home_template')
var db = require('../lib/db')
/* GET home page. */
router.get('/', function(req, res, next) {
  db.getConnection((err, connection) => {
    if(err){
      console.log(err);
    }
    connection.query("SELECT * FROM subjects", (err,subjects) => {
      connection.release();
      if (err){
        console.log(err);
      }
      else{
        var body = template.home_body(subjects);
        res.send(template.home_HTML(body));
      }
    })
  })
});

module.exports = router;
