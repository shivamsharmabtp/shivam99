var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

var app = express();

var urlencodedParser = (bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(bodyParser.json());


//============ check user cookies ==============//
app.use(function(req, res, next){
  if (req.url === '/auth.html' || req.url === '/js/jquery.min.js' ) return next();
  if (req.url === '/login' || req.url === '/register' ) return next();
	var cookies = req.headers.cookie;
	var regex = /li\s*=\s*(.+)\;/;
	if(cookies){
		var loggedin = regex.exec(cookies)[1];
		if(loggedin != 1){
			res.redirect('http://krsna72.localtunnel.me/auth.html');
		}
		else{
		next();
		}
	}
	else{
    res.redirect('http://krsna72.localtunnel.me/auth.html');
	}
});
//=================================================//

app.use('/', express.static(__dirname + '/public'));

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database : 'sampleDb'
});

connection.connect(function(err) {
	if(!!err){
		console.log('Database not connected. Error : ' + err);
	}else{
		console.log('Database connected...');
	}
});

app.post('/register',urlencodedParser, function(req,res){
  var userObject = {
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: req.body.password,
    gender : req.body.gender,
    bday : req.body.birthday_day,
    bmonth : req.body.birthday_month,
    byear : req.body.birthday_year,
    COLLEGE : req.body.college
  }
  var sql = "INSERT INTO `users` set ?";
  connection.query(sql, userObject, function (err, result) {
    if (err) throw err;
    console.log("1 user registered");
    res.cookie('li',1);
    res.cookie('usr_mail',req.body.email, {maxAge: 36000000});
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end();
  });
});

app.post('/login', urlencodedParser, function (req, res) {
	var name = "";
   connection.query('SELECT * FROM users WHERE EMAIL = ?',req.body.email,function(err,rows,fields){
   		if(!!err) {
   			console.log('Error in login query!.');
   			console.log(err);
   		}
   		else{
		 			if(!rows.length){
				  console.log("No such user found.!");
          res.writeHead(404, {'Content-Type': 'text/html'});
          res.end();
					}
					else{
					  for (var i in rows){
					    if(rows[i].PASSWORD==req.body.password){
					      console.log("User " + rows[i].ID + " logged in!");
					      res.cookie('li', '1' , {maxAge: 300000000});
					      res.cookie('usr_mail', rows[i].EMAIL, {maxAge: 300000000});
					      res.writeHead(200, {'Content-Type': 'text/html'});
					      res.end();
					      break;
					    }
					    else{
					    console.log("Password is wrong.!");
              res.writeHead(404, {'Content-Type': 'text/html'});
              res.end();
					    break;
					    }
					  }
					}
    		}
   });
});

app.post('/logout', urlencodedParser, function (req, res) {
	console.log("logging out");
	res.cookie('li', '0');
	res.cookie('usr_mail', 0);
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end();
});

app.post('/mainPageData', urlencodedParser, function(req, res){
  connection.query('SELECT * FROM users WHERE EMAIL = ?',req.body.email,function(err, rows, fields){
    if(!!err){
      // error function
      console.log('error mainPageData query');
    }else{
      for(var i in rows){
        var data = {
          id : rows[i].ID,
          fname : rows[i].FNAME,
          lname : rows[i].LNAME,
          college : rows[i].COLLEGE
        }
        res.send(data);
      }
    }
  });
});

app.post('/accountPageData', urlencodedParser, function(req, res){
  connection.query('SELECT * FROM users WHERE EMAIL = ?',req.body.email,function(err, rows, fields){
    if(!!err){
      // error function
      console.log('error mainPageData query');
    }else{
      for(var i in rows){
        var data = {
          id : rows[i].ID,
          fname : rows[i].FNAME,
          lname : rows[i].LNAME,
          gender : rows[i].GENDER,
          year : rows[i].BYEAR,
          month : rows[i].BMONTH,
          day : rows[i].BDAY,
          fos : rows[i].FOS,
          hor : rows[i].HOR,
          room : rows[i].ROOM,
          home : rows[i].HOME,
          skills : rows[i].SKILLS,
          projects : rows[i].PROJECTS,
          contact : rows[i].CONTACT,
          college : rows[i].COLLEGE
        }
        res.send(data);
        break;
      }
    }
  });
});

app.post('/getcollege', urlencodedParser, function(req,res){
  connection.query('SELECT * FROM colleges WHERE CID = ?',req.body.collegeid,function(err,rows,fields){
    if(!!err){
      console.log('error in get college query : ' + err);
    }else{
      for(var i in rows){
        var cdata = {
          id : rows[i].CID,
          cname : rows[i].NAME,
          address : rows[i].ADDRESS
        }
        res.send(cdata);
        break;
      }
    }
  });
});

app.post('/upload', function(req, res){
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.uploadDir = path.join(__dirname, '/uploads');
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, 'abc' + file.name ));
  });

  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  form.on('end', function() {
    res.end('success');
  });

  form.parse(req);

});

app.listen(3100, () => console.log('Listening on port 3100.'));
