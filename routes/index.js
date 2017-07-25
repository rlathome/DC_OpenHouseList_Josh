var express = require('express');
var router = express.Router();
var request = require('request');
var https = require('https');
let apiKey=process.env.DISPLET_API_KEY;
let domain = (process.env.NODE_ENV==='production') ? 'http://localhost:3000' : 'http://vast-shore-14133.herokuapp.com';
let stage = process.env.NODE_ENV;
console.log('app in stage: ',stage);
// let params = 'latitude,longitude,image_urls,street_name,subdivision,street_number,square_feet,mls_number,list_price,open_house_events,address,full_baths,num_bedrooms,half_baths';

let params='';
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/featured',function(req,res,next){
  let url = "https://api.displet.com/residentials/search?authentication_token="+apiKey+"&;return_fields="+params+"&min_bedrooms=2&min_bathrooms=1&min_list_price=350&open_house=y&open_house_within=7&limit=10";

  let options = {
    url:url,
    headers:{
      'Accept':'application/javascript',
      'Referer': domain
    }
  }

  request(options, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.
    body=JSON.parse(body);
    res.json(body);
  });
});

router.get('/open_houses',function(req,res,next){
  console.log('api key: ',apiKey);
  // let params='';
  let url = "https://api.displet.com/residentials/search?authentication_token="+apiKey+"&;return_fields="+params+"&min_bedrooms=2&min_bathrooms=1&min_list_price=350&open_house=y&open_house_within=7";

  let options = {
    url:url,
    headers:{
      'Accept':'application/javascript',
      'Referer':domain
    }
  }

  request(options, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.
    body=JSON.parse(body);
    res.json(body);
  });
});

router.get('/neighborhoods',function(req,res,next){
  params = '';
  let url = "https://api.displet.com/residentials/search?authentication_token="+apiKey+"&;return_fields="+params+"&min_bedrooms=2&min_bathrooms=1&min_list_price=350";
  let options = {
    url:url,
    headers:{
      'Accept':'application/javascript',
      'Referer':domain
    }
  }
  request(options, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    body=JSON.parse(body);
    // console.log('body: ',body);
    let neighborhoods=[];
    let results = [];
    body.results.map((result)=>{
      results.push(result.subdivision);
    });
    results.forEach((subdiv)=>{
      let exists = false;
      neighborhoods.forEach((val)=>{
        if(val==subdiv){
          exists = true;
        }
      });
      if(exists==false){
        neighborhoods.push(subdiv);
      }
    });
    neighborhoods = neighborhoods.sort();
    console.log('sending back: ',neighborhoods);
    res.json(neighborhoods);
  });
});

router.post('/submitform',function(req,res,next){
  let form_data = req.body;
  console.log('submitting: ',form_data);
});

router.get('/price/:id',function(req,res,next){
  let price_index = req.params.id;
  console.log('price index: ',price_index);
  switch(price_index){
    case '3':
    price = "&min_list_price=0&max_list_price=500";
    console.log('3 was pressed');
    break;
    case '4':
    price = "&min_list_price=500&max_list_price=1000";
    break;
    case '5':
    price = "&min_list_price=1000&max_list_price=3000";
    break;
    case '6':
    price = "&min_list_price=3000";
    break;
    default:
    price="&min_list_price=1000000&max_list_price=3000000";
  }
  let url = "https://api.displet.com/residentials/search?authentication_token="+apiKey+"&;return_fields="+params+"&min_bedrooms=2&min_bathrooms=1&min_list_price=350&open_house=y&open_house_within=7&limit=50"+price;

  let options = {
    url:url,
    headers:{
      'Accept':'application/javascript',
      'Referer':domain
    }
  }

  request(options, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
    body=JSON.parse(body);
    res.json(body);
  });
});

module.exports = router;
