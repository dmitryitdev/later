const express = require('express');
const app = express();
//const articles = [{ title: 'Пример' }];
const bodyParser = require('body-parser');
const Article = require('./db').Article;

const read = require('node-readability'); 
const url = 'http://www.manning.com/cantelon2/'; 
read(url, (err, result)=> {
    // result содержит .title и .content });
});

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/articles', (req, res, err) => {
    Article.all((err, articles) => {
        if (err) return next(err);
        res.send(articles);
    });    
});

app.post('/articles', (req, res, next) => {
    const url = req.body.url;
    
    read(url, (err, result) => {
        if (err || !result) res.status(500).send('Ошибка загрузки статьи');
        Article.create (
            { title: result.title, content: result.content },
            (err, article) => {
                if (err) return next(err);
                res.send('OK');
            }
        );
    });
});

app.get('/articles/:id', (req, res, next) => {
    const id = req.params.id;
    Article.find(id, (err, article) => {
        if (err) return next(err);
        res.send(article);
    });    
});

app.delete('/articles/:id', (req, res, next) => {
    const id = req.params.id;
    Article.delete(id, (err) => {
        if (err) return next(err);
        res.send({ message: 'Удалено' });
    });    
});

app.listen(app.get('port'), () => {
    console.log('App started on port', app.get('port'));
});

module.exports = app;