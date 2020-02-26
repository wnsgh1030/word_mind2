var express = require('express');
var router = express.Router();
var template = require('../template/map_template');
var db = require('../lib/db');

router.get('/:s_no', function (req, res, next) {
    db.getConnection((err, conncetion) => {
        if (err) {
            console.log(err);
        }
        conncetion.query('SELECT s_name FROM subjects WHERE s_no = ?; SELECT w_no, w_name FROM words WHERE s_no = ?; SELECT e_no, e_name, words.w_no FROM words, examples WHERE words.w_no = examples.w_no AND s_no = ?',
         [req.params.s_no, req.params.s_no, req.params.s_no], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                var subject = result[0];
                var words = result[1];
                var examples = result[2];
                var wordlist = [];
                var i = 0;
                while(i < words.length){
                    wordlist.push(words[i].w_no)
                    i = i + 1
                }
                if(wordlist.length == 0) {
                    var body = template.map_body(subject, words, examples, []);
                    var html = template.map_HTML(body);
                    res.send(html);
                }
                else{
                    conncetion.query('SELECT * FROM relationship WHERE w1_no IN (?) OR w2_no IN (?)', [wordlist, wordlist], (err, relationship) => {
                        conncetion.release();
                        if(err){
                            console.log(err);
                        }
                        else{
                            var body = template.map_body(subject, words, examples, relationship);
                            var html = template.map_HTML(body);
                            res.send(html);
                        }
                    })
                }
            }
        })
    })
});
module.exports = router;