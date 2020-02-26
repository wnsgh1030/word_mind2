var express = require('express');
var router = express.Router();
var template = require('../template/subjects_template');
var db = require('../lib/db');

router.get('/create-form', function (req, res, next) {
    var body = template.create_subjects_body();
    var style = template.create_update_subjects_style();
    var html = template.subjects_HTML(body, style);
    res.send(html);
});
router.post('/create-process', function (req, res, next) {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query('INSERT INTO subjects SET ?', req.body, (err, result) => {
            connection.release();
            if (err) {
                console.log(err);
            }
            else {
                console.log(result);
                res.redirect('/');
            }
        })
    })
});
router.get('/:s_no', function (req, res, next) {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query('SELECT * FROM subjects WHERE s_no != ?; SELECT w_no, w_name FROM words WHERE s_no = ?', [req.params.s_no, req.params.s_no], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                var subjects = result[0];
                var words = result[1];
                connection.query('SELECT e_no, e_name, words.w_no FROM words , examples WHERE words.w_no = examples.w_no AND s_no = ?; SELECT * FROM subjects WHERE s_no = ?;', [req.params.s_no, req.params.s_no], (err, result) => {
                    connection.release();
                    if (err) {
                        console.log(err);
                    }
                    else {
                        var subject = result[1];
                        var i = 0;
                        var words_examples = new Array();
                        while (i < words.length) {
                            var word = words[i];
                            var examples = result[0].filter(function (item) {
                                return item.w_no == words[i].w_no;
                            })
                            word.examples = examples;
                            words_examples.push(word);
                            i = i + 1
                        }
                        var body = template.subjects_body(subjects, words_examples, subject);
                        var style = template.subjects_style();
                        var html = template.subjects_HTML(body, style);
                        res.send(html);

                    }
                })
            }
        })
    })
})
router.get('/update-form/:s_no', function (req, res, next) {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query('SELECT * FROM subjects WHERE s_no = ?', req.params.s_no, (err, subject) => {
            connection.release();
            if (err) {
                console.log(err);
            }
            else {
                var body = template.update_subjects_body(subject);
                var style = template.create_update_subjects_style();
                var html = template.subjects_HTML(body, style);
                res.send(html);
            }
        })
    })

});
router.post('/update-process/:s_no', function (req, res, next) {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query('UPDATE subjects SET ? WHERE s_no = ?', [req.body, req.params.s_no], (err, result) => {
            connection.release();
            if (err) {
                console.log(err);
            }
            else {
                console.log(result);
                res.redirect('/');
            }
        })
    })
});
router.post('/delete-process/:s_no', function (req, res, next) {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query('DELETE FROM subjects WHERE s_no = ?', req.params.s_no, (err, result) => {
            connection.release();
            if (err) {
                console.log(err);
            }
            else {
                console.log(result);
                res.redirect('/');
            }
        })
    })
});
module.exports = router;