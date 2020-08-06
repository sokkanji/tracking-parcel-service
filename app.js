const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app=express();
const port=3000;

app.set('views', './views');
app.set('view engine', 'ejs');
app.locals.pretty = true;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use((err, req, res, next)=>{
  console.error(err.stack);
  res.status(500).send('Something broke');
});

const t_key = 'qOFWCCHGOUDVU7cf6r5z5w';
let _t_code='', _t_invoice='', json='';

app.get('/', (req, res)=>{
    res.render('index', {title:'배송 통합 조회 시스템'});
});

app.post('/tracking', (req, response)=>{
  _t_code = req.body.t_code,
  _t_invoice = req.body.t_invoice;

  request.get({
      uri: 'https://info.sweettracker.co.kr/api/v1/trackingInfo',
      qs: {
        't_key': t_key,
        't_code': _t_code,
        't_invoice': _t_invoice
      }
    }, (err, res, body)=> {
        json = JSON.parse(body);
        response.json(json);
    });  
});

app.listen(port, ()=>{
    console.log('Connected express server at localhost...');
});