const express = require('express');
const router = express.Router();
const template = require('../template/words_template');
const db = require('../lib/db');

router.get('/create-form', function (req, res, next) {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query('SELECT * FROM subjects WHERE s_no = ?; SELECT * FROM words WHERE s_no = ?;', [req.query.s_no, req.query.s_no], (err, result) => {
            connection.release();
            if (err) {
                console.log(err);
            }
            else {
                const body = template.create_words_body(result[0], result[1]);
                const html = template.words_HTML(body);
                res.send(html);
            }
        })
    })
});

router.post('/create-process', function (req, res, next) {
    const relationship = new Array();
    const w2_no = req.body.w2_no;
    const s_no = req.body.s_no;
    const description = req.body.description;
    delete req.body.w2_no;
    delete req.body.description;
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query('INSERT INTO words SET ?; SELECT LAST_INSERT_ID() AS w1_no;', req.body, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                if (Array.isArray(w2_no)) {
                    let i = 1
                    while (i < w2_no.length) {
                        let relation = new Array();
                        relation.push(result[1][0].w1_no);
                        relation.push(w2_no[i]);
                        relation.push(description[i]);
                        relationship.push(relation);
                        i = i + 1;
                    }
                    connection.query('INSERT INTO relationship VALUES ?', [relationship], (err, result) => {
                        connection.release();
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log(result);
                            res.redirect(`/subjects/${s_no}`);
                        }
                    })
                }
                else {
                    res.redirect(`/subjects/${s_no}`);
                }
            }
        })
    })
});

router.get('/update-form', function (req, res, next) {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query('SELECT s_name FROM subjects WHERE s_no = ?; SELECT w_no, w_name FROM words WHERE s_no = ?;', [req.query.s_no, req.query.s_no], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                const s_name = result[0];
                const words = result[1];
                connection.query('SELECT * FROM words WHERE w_no = ?; SELECT * FROM relationship WHERE w1_no = ?', [req.query.w_no, req.query.w_no, req.query.w_no], (err, result2) => {
                    connection.release();
                    if (err) {
                        console.log(err);
                    }
                    else {
                        const word = result2[0];
                        const relation = result2[1];
                        const body = template.update_words_body(s_name, word, words, relation);
                        const html = template.words_HTML(body);
                        res.send(html);
                    }
                })
            }
        })
    })
});

router.post('/update-process', function (req, res, next) {
    const relationship = new Array();
    const w2_no = req.body.w2_no;
    const s_no = req.body.s_no;
    const description = req.body.description;
    delete req.body.w2_no;
    delete req.body.description;
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query('UPDATE words SET ? WHERE w_no = ?; DELETE FROM relationship WHERE w1_no = ?', [req.body, req.body.w_no, req.body.w_no], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(result);
                if (Array.isArray(w2_no)) {
                    let i = 1
                    while (i < w2_no.length) {
                        let relation = new Array();
                        relation.push(req.body.w_no);
                        relation.push(w2_no[i]);
                        relation.push(description[i]);
                        relationship.push(relation);
                        i = i + 1;
                    }
                    connection.query(' INSERT INTO relationship VALUES ?;', [relationship], (err, result) => {
                        connection.release();
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log(result);
                            res.redirect(`/subjects/${s_no}`);
                        }
                    })
                }
                else {
                    connection.release();
                    res.redirect(`/subjects/${s_no}`);
                }
            }
        })
    })
});
router.post('/delete-process', function (req, res, next) {
    console.log(req.body)
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query('DELETE FROM words WHERE w_no = ?', [req.body.w_no], (err, result) => {
            connection.release();
            if (err) {
                console.log(err);
            }
            else {
                console.log(result);
                res.redirect(`/subjects/${req.body.s_no}`);
            }
        })
    })
});

router.get('/:w_no', function (req, res, next) {
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
        }
        connection.query('SELECT * FROM words WHERE w_no = ? ; SELECT w_name, description FROM relationship, words WHERE w1_no = ? AND w2_no = w_no; SELECT * FROM examples WHERE w_no = ?', 
        [req.params.w_no, req.params.w_no, req.params.w_no, req.params.w_no], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                const body = template.words_body(result[0], result[1], result[2]);
                const html = template.words_HTML(body);
                res.send(html);
            }
        })
    })
});
module.exports = router;