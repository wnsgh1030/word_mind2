const express = require('express');
const router = express.Router();
const template = require('../template/examples_template');
const db = require('../lib/db');

router.get('/create-form', function (req, res, next) {
    db.getConnection((err, connection) => {
        if(err){
            console.log(err);
        }
        connection.query('SELECT * FROM words WHERE w_no = ?', req.query.w_no, (err, word) => {
            connection.release();
            if(err){
                console.log(err);
            }
            else{
                const body = template.create_examples_body(word);
                const html = template.examples_HTML(body);
                res.send(html);
            }
        })
    })    
});

router.post('/create-process', function (req, res, next) {
    const s_no = req.body.s_no;
    delete req.body.s_no;
    db.getConnection((err, connection) => {
        if(err){
            console.log(err);
        }
        connection.query('INSERT INTO examples SET ?', req.body, (err, result) => {
            connection.release();
            if(err){
                console.log(err);
            }
            else{
                console.log(result);
                res.redirect(`/subjects/${s_no}`);
            }
        })
    })
});

router.get('/update-form', function (req, res, next) {
    db.getConnection((err, connection) => {
        if(err){
            console.log(err);
        }
        connection.query('SELECT e_no, e_name, e_content, examples.w_no, w_name FROM examples JOIN words ON examples.w_no = words.w_no WHERE e_no = ?', req.query.e_no, (err, example) => {
            connection.release();
            if(err){
                console.log(err);
            }
            else{
                const body = template.update_examples_body(example, req.query.s_no);
                const html = template.examples_HTML(body);
                res.send(html);
            }
        })
    })    
});
router.post('/update-process', function (req, res, next) {
    const s_no = req.body.s_no;
    delete req.body.s_no;
    db.getConnection((err, connection) => {
        if(err){
            console.log(err);
        }
        connection.query('UPDATE examples SET ? WHERE e_no = ?', [req.body, req.body.e_no], (err, result) => {
            connection.release();
            if(err){
                console.log(err);
            }
            else{
                console.log(result);
                res.redirect(`/subjects/${s_no}`);
            }
        })
    })
});
router.post('/delete-process', function (req, res, next) {
    db.getConnection((err, connection) => {
        if(err){
            console.log(err);
        }
        connection.query('DELETE FROM examples WHERE e_no = ?', [req.body.e_no], (err, result) => {
            connection.release();
            if(err){
                console.log(err);
            }
            else{
                console.log(result);
                res.redirect(`/subjects/${req.body.s_no}`);
            }
        })
    })
});

module.exports = router;