var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ProxyLists = require('proxy-lists');
var request = require('request')
var fs = require('fs')
var csv = require('fast-csv')
var http = require('http')
var HttpsProxyAgent = require('https-proxy-agent');  
var routes = require('./routes/index');
var users = require('./routes/users');
var google = require('google')

var app = express();
/*
NOTE : A better way to do this would be to rotate proxies - 

Google Search Proxies are pretty hard to find without spending 
  a) a lot of money
  b) a lot of time

So if you have a very good IP/Proxy API, you should likely use it to prevent IP bans.
Below is an option to use a proxy for the Google Search API

google.requestOptions = {
  proxy: 'http://localhost:8888',
}

Below is a NPM package to scour proxies - after working with them for a while, I realized that only a few worked - and more than often,
did not support google search. Moving on.
var gettingProxies = ProxyLists.getProxiesFromSource('freeproxylists', options);

gettingProxies.on('data', function(p) {
  // Received some proxies.
  var proxies = p
  for(proxy in proxies){
    var url = "http://" + proxies[proxy]["ipAddress"]+":"+proxies[proxy]["port"]
  }
  proxyArray = proxies
});

gettingProxies.on('error', function(error) {
  // Some error has occurred.
  console.error(error);
});

gettingProxies.once('end', function() {
  // Done getting proxies.
});
*/

var proxyArray = [];
var links = [];
var miniDescription = [];
var csvArray = [];
var companies = [];

//Store the original CSV Data in csvArray

fs.createReadStream("data.csv")
  .pipe(csv())
  .on("data", function(data){
    if(data[0] == "Company Name"){
      data.push("URLs");
      csvArray.push(data);
    }else{
      csvArray.push(data)
      companies.push(data[0]);
    }
  })
  .on("end", function(){
    console.log("done");
    console.log(companies);
    checkGoog(companies, 0);
  });

function checkGoog(companyList, position){
  if(position < companyList.length){
    start(companyList[position], function(){
      position ++;
      console.log("Onto the next company, " + companyList[position] + " ... ")
      setTimeout(function(){checkGoog(companyList,position)},0);
      console.log(links)
      console.log(miniDescription)
    })
  }else{
    console.log(position);
    writeToNewCSV(csvArray)
  }
}
/*
60.250.72.252:8080
94.23.157.1:8080
*/
function start(company, callback){
var prox = proxyArray[Math.floor(Math.random()*proxyArray.length)];

//c7d7556c-db78-4d37-b2b4-b34f8c71c541
google(company, function (err, res){
  if (err) console.error(err)
  links.push(res.links[0].href)
  miniDescription.push(res.links[0].description)
  callback();
})

}
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

function writeToNewCSV(array){
  console.log(array);
  var csvStream = csv.createWriteStream({headers:true}),
  writableStream = fs.createWriteStream("output.csv"),
  excsvStream = csv.createWriteStream({headers:true}),
  extraStream = fs.createWriteStream("bonus.csv")

  writableStream.on("finish", function(){
    console.log("DONE!");
  });

  csvStream.pipe(writableStream);
  excsvStream.pipe(extraStream);
  //iterate through the rows, if we see that a company has a field, let's push the contents of the URLs.
  for (obj in csvArray){
    var a = csvArray[obj];
    console.log(a);
    if(obj < links.length){
      a.push(links[obj]);
      excsvStream.write([links[obj],miniDescription[obj]])
    }
    console.log(a);
    csvStream.write(a);
    
  }
  csvStream.end();
  excsvStream.end();
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
module.exports = app;
