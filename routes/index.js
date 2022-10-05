var express = require('express');
const { generate_sitemap } = require('../middleware/sitemap');

const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Footer = require('../src/Footer/footer.entity');




router.get('/sitemap.xml', generate_sitemap);


router.get('/register', function (req, res, next) {
	return res.render('register');
});


router.post('/register', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;


	if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							email:personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"You are registered,You can login now."});
				}else{
					res.send({"Success":"Email is already used."});
				}

			});
		}else{
			res.send({"Success":"password is not matched"});
		}
	}
});

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		if(data){
			
			if(data.password==req.body.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				res.send({"Success":"Success!"});
				
			}else{
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not registered!"});
		}
	});
});



router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});

router.get('/forgetpass', function (req, res, next) {
	res.render("forget");
});

router.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		console.log(data);
		if(!data){
			res.send({"Success":"This Email Is not registered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	});
	
});


router.get("/search", async (req,res)=>{
	const tag=req.query.result;
	Product.find({tags:tag}, function(err,products){
	  if(err){
		console.log(err);
	  }
	  else{
		res.render("search",{products:products});
	  }
	});
});


router.get("/product/:name", function(req,res) { 
	const requestedImgName = req.params.name;
   
	
   Product.findOne({name: requestedImgName}, function(err, image){
  
	res.render("product", {image:image});
  
	  });
});

router.get("/contact", function (req, res) {
	Footer.find({}, (err, items) => {
	  if (err) {
		  console.log(err);
		  res.status(500).send('An error occurred', err);
	  }
	  else {
		  res.render('contact', { items: items});
	  }
    });
});


router.get("/terms", function(req,res){
	Footer.find({}, (err, items) => {
	  if (err) {
		  console.log(err);
		  res.status(500).send('An error occurred', err);
	  }
	  else {
		  res.render('terms', { items: items});
	  }
	})
});


router.get("/privacy-policy", function(req,res){
	Footer.find({}, (err, items) => {
	  if (err) {
		  console.log(err);
		  res.status(500).send('An error occurred', err);
	  }
	  else {
		  res.render('privacy-policy', { items: items});
	  }
	})
});

router.get("/about", function(req,res){
	Footer.find({}, (err, items) => {
	  if (err) {
		  console.log(err);
		  res.status(500).send('An error occurred', err);
	  }
	  else {
		  res.render('about', { items: items});
	  }
	})
});



module.exports = router;