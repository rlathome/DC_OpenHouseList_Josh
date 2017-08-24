var express = require('express');
var router = express.Router();
var request = require('request');
var https = require('https');
var FormData = require('form-data');
var Featured = require('../models/featured.js');
var formData = new FormData();
var curl = require('curlrequest');



// let domain = (process.env.NODE_ENV==='development') ? 'http://localhost:3000' : 'http://vast-shore-14133.herokuapp.com';
// let domain = 'http://localhost:3000';

// let apiKey=process.env.DISPLET_API_KEY;
let apiKey = '82b44a7662b0abb55eebf365a61c50399b512935';
let domain = 'http://vast-shore-14133.herokuapp.com';

// let domain = 'http://localhost:3000";



let stage = process.env.NODE_ENV;
console.log('app in stage: ',stage);
console.log('domain: ',domain);
// let params = 'latitude,longitude,image_urls,street_name,subdivision,street_number,square_feet,mls_number,list_price,open_house_events,address,full_baths,num_bedrooms,half_baths';

let params='';
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/featured',function(req,res,next){
  let url = "https://api.displet.com/residentials/search?authentication_token="+apiKey+"&;return_fields="+params+"&open_house=y&open_house_within=7&state=DC&limit=10";

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
  let params = 'latitude,longitude,image_urls,street_name,street_pre_direction,street_post_direction, subdivision,street_number,square_feet,mls_number,list_price,open_house_events,address,full_baths,num_bedrooms,half_baths';
  let url = "https://api.displet.com/residentials/search?authentication_token="+apiKey+"&open_house=y&state=DC&limit=2000";

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

router.get('/listing/:mls',function(req,res,next){
  let listing = req.params.mls;
  // listing = "FX9824807";
  console.log('mls listing: ',listing);
  let url = "https://api.displet.com/residentials/search?authentication_token="+apiKey+"&;return_fields="+params+"&mls_number="+listing;
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
  // let to= 'info@rlahre.com';

  let first = form_data.first;
  let last = form_data.last;
  let mls = form_data.mls;
  let subject = "A New Prospect Has Contacted You from DC's Open House List!";
  let text = form_data.textarea;
  let phone = form_data.phone;
  let email = form_data.email;
  let agent_email = form_data.agent_email;
  let to = agent_email;

  var mailcomposer = require('mailcomposer');

  var domain = 'info.dcopenhouselist.com';
  var apiKey = 'key-602b6fef248551d53fee98ac2dbdef70';
  var mailgun = require('mailgun-js')({apiKey:apiKey, domain:domain});

  var mail = mailcomposer({
    subject,
    to,
    from:first+' '+last+'<'+email+'>',
    body:text,
    phone,
    email,
    mls,
    html:'<div>Re: MLS# '+mls+'<br/>'+text+'</div>'+'<div>'+phone+'</div>'+'<div>'+email+'</div>'
  });

  mail.build(function(mailBuildError, message){
    var dataToSend = {
        to: to,
        message: message.toString('ascii')
    };
    mailgun.messages().sendMime(dataToSend, function (sendError, body) {
        if (sendError) {
            console.log(sendError);
            return;
        }
        res.json(body);
    });
});


  // mailgun.messages().send(formData, function (error, body) {
  //   console.log('reply: ',body);
  //   res.json(body);
  // });
});

router.post('/createagent',function(req,res,next){
  let body = req.body;
  console.log('body: ',body);
  let firstname = body.firstname;
  let lastname = body.lastname;
  let headshot_url = (body.headshot_url) ? body.headshot_url : 'na';
  let email = (body.email) ? body.email : 'na';
  let phone =  (body.phone) ? body.phone : 'na';
  let facebook_url =  (body.facebook_url) ? body.facebook_url : 'na';
  let instagram_url =  (body.instagram_url) ? body.instagram_url : 'na';
  let linkedin_url =  (body.linkedin_url) ? body.linkedin_url : 'na';
  let password =  (body.password) ? body.password : 'na';

  let name=firstname+' '+lastname;
  if(password !=="!E28_Ey9scbCgC_)"){
    console.log('incorrect');
    res.send('incorrect password');
    return;
  }
  let data = "name="+name+"&headshot_url="+headshot_url+"&email="+email+"&phone="+phone+"&facebook_url="+facebook_url+"&instagram_url="+instagram_url+"&linkedin_url="+linkedin_url+"&authentication_token="+apiKey;

  let url = "https://api.displet.com/agents";
  console.log('agent creation url: ',url);

  let options = {
    url:url,
    data:data,
    headers:{
      'Accept':'application/javascript',
      'Referer':domain
    }
  }

  curl.request(options,function(error, data_returned) {
    console.log('error:', error); // Print the error if one occurred
    console.log('returned: ',data_returned);
    data_returned=JSON.parse(data_returned);
    // console.log('data_returned: ',data_returned);
    res.json(data_returned);
  });

});

router.post('/addfeatured',function(req,res,next){
  let body = req.body;
  console.log('body: ',body);
  let mls = body.mls;

  let password =  (body.password) ? body.password : 'na';

  if(password !=="!E28_Ey9scbCgC_)"){
    console.log('incorrect');
    res.send('incorrect password');
    return;
  }

  let newFeatured = new Featured({mls});
  newFeatured.save(function(err,mls){
    if(err) console.log('err! ',err);
    res.json(mls);
  });
});

router.get('/getfeaturedlistings',function(req,res,next){
  console.log('getting featured');
  Featured.find({},'',function(err,response){
    if(err) console.log('err - ',err);
    // res.json(response);
    // var numbs = JSON.stringify(response);
    console.log('response: ',response);
    var results = [];
    let listings = [];
    let params = '';
    for(let i=0;i<response.length;i++){
      listings.push(response[i]["mls"]);
    }
    listings = listings.join(',');
      // listing = JSON.parse(listing);
      // results.push(listing);
      let url = "https://api.displet.com/residentials/search?authentication_token="+apiKey+"&;return_fields="+params+"&mls_number="+listings;
      console.log('url: ',url);
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
        body = JSON.parse(body);
        res.json(body);
      });
  });
});

router.post('/deletefeatured',function(req,res,next){
  let listingID = req.body.listingID;
  console.log('id: ',listingID);
  let password = req.body.password;
  if(password !=="!E28_Ey9scbCgC_)"){
    console.log(password,'is incorrect');
    res.send('incorrect password');
    return;
  }
  Featured.findOneAndRemove({mls:listingID},function(err,response){
    if(err) console.log('err - ',err);
    res.json(response);
  });
});


router.post('/deleteagent',function(req,res,next){
  let body=req.body;
  let agentID = body.agentID;
  let password = body.password;
  if(password !=="!E28_Ey9scbCgC_)"){
    console.log('incorrect');
    res.send('incorrect password');
    return;
  }
  console.log('agentID: ',agentID);
  let url="https://api.displet.com/agents/"+agentID+"?authentication_token="+apiKey;
  let options = {
    url:url,
    method:'DELETE',
    headers:{
      'Accept':'application/javascript',
      'Referer':domain
    }
  }

  curl.request(options,function(error, data_returned) {
    console.log('error:', error); // Print the error if one occurred
    console.log('returned: ',data_returned);
    data_returned=JSON.parse(data_returned);
    // console.log('data_returned: ',data_returned);
    res.json(data_returned);
  });
});

router.get('/getallagents',function(req,res,next){
  let url="https://api.displet.com/agents/"+"?authentication_token="+apiKey;
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
    res.json(body);
  });
});


router.get('/getagent',function(req,res,next){
  let body=req.body;
  let agentID = body.agentID;
  let url="https://api.displet.com/agents/"+agentID+"?authentication_token="+apiKey;
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
    res.json(body);
  });
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
