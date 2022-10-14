const path = require('path');
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, './config/.env') })
const { generate_sitemap } = require('./middleware/sitemap');

/** for passport */
const csrf=require('csurf');
const passport=require('passport');
const logger=require('morgan');
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const authRouter = require('./routes/auth');
const LocalStrategy = require('passport-local');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const compression = require('compression');

const User = require('./models/User');
const Product = require('./src/companies/company.entity');
const Footer = require('./src/Footer/footer.entity');

const options = require('./src/admin.options');
const buildAdminRouter = require('./src/admin.router');
const { default: AdminBro } = require('admin-bro');
dotenv.config({path: ".config/config.env"});


const app =express();

app.use('/', authRouter);
app.use(express.json());
app.use((req,res, next )=>{
  res.locals.user=req.username;
  next();
})

dotenv.config();
app.use(bodyParser.json());
passport.use(new LocalStrategy(User.authenticate()));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const admin = new AdminBro(options);
const router = buildAdminRouter(admin);
const cookieParser=require('cookie-parser');

app.use(admin.options.rootPath, router);
  
app.use('/uploads', express.static('uploads'));
    

dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config();
const mongo=process.env.MONGO_URI;
mongoose.connect( mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,

})
console.log('db connected');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

var ensureLoggedIn = ensureLogIn();

app.use(express.static(path.join(__dirname, 'public')));

// compress all responses
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');	
app.locals.pluralize = require('pluralize');


app.use(express.static(__dirname + '/views'));


app.use(cookieParser());
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));
app.use(csrf());
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

app.use(function(req, res, next) {
  var msgs = req.session.messages || [];
  res.locals.messages = msgs;
  res.locals.hasMessages = !! msgs.length;
  req.session.messages = [];
  next();
});
app.use(function(req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
});

/** GET PHOTOS FROM DB */
function fetchProducts(req,res,next) {
	
  Product.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send('An error occurred', err);
    }
    else {
      res.render('index', { items: items});
    }
    })

};





app.get('/sitemap.xml', generate_sitemap);
app.use(function(req,res,next){
if (req.user) {
    res.locals.user = req.user;
}
next();
});


app.get('/',fetchProducts, function(req, res, next) {
  if (!req.user) { return res.render('index'); }
  next();
}, fetchProducts, function(req, res, next) {
  res.locals.filter = null;
  res.render('index', { user: req.user });
});



app.get('/categories', function(req, res, next) {
  res.render('categories');
});
app.post("categories",function(req,res, next){

	
})


app.get('/register', function(req, res, next) {
  res.render('register');
});

/* POST /signup
 *
 * This route creates a new user account.
 *
 * A desired username and password are submitted to this route via an HTML form,
 * which was rendered by the `GET /signup` route.  The password is hashed and
 * then a new user record is inserted into the database.  If the record is
 * successfully created, the user is logged in.
 */
app.post('/register', function(req, res, next) {
  User.register(new User({ email: req.body.email, username: req.body.username }), req.body.password, 
  function (err, user) {
    if (err) {
        res.json({ success: false, message: "Your account could not be saved. Error: " + err });
    }
    else {
      req.login(user, function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
      })
    }
  })
});

app.get('/login', function(req, res, next) {
	res.render('login');
  });
  
  
app.post('/login/password', passport.authenticate('local', {
	successReturnToOrRedirect: '/',
	failureRedirect: '/login',
	failureMessage: true

 }));
  

 app.get('/profile',function(req,res, next){
    res.render('profile');
 });
 app.post('/profile',function(req,res, next){
	const user=req.locals.user;
	User.find({user}, function(err,user){
		if(err){
		  console.log(err);
		}
		else{
		  res.render("profile",{user:user});
		}
	  });
 });


app.get('/logout', function(req, res, next) {
	req.session.destroy(function (err) {
		res.redirect("/"); //Inside a callback… bulletproof!
	  });
  });
  

app.get('/forgetpass', function (req, res, next) {
	res.render("forget");
});

app.post('/forgetpass', function (req, res, next) {
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


app.get("/search", async (req,res)=>{
	const search=req.query.result;

	let regex = new RegExp(`^[${search}0-9._-]+$`, "ig");

	
	Product.find({tags:{'$regex':regex}},function (err,products){
		if(err){
			console.log(err);
		  }
		  else{
			res.render("search",{products:products,tag:search});
		  }
	})

	
	
});


app.get("/product/:name", function(req,res, next) { 


	const requestedImgName = req.params.name;
	
  
     Product.findOne({name: requestedImgName}, function(err, image){

	    const category= image.category;
		console.log(category);
		Product.find({category:category}).limit(4).sort({"name":-1}).then(items=>{
			if(!items){
				const error=new Error("No img is there to fetch");
				error.statusCode=404;
				throw(error);
			}
			
			return res.render('product', {
				items:items, image:image
			 });
		}).catch(err=>console.log(err));
		
			  
	});
})



app.get("/contact", function (req, res) {
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


app.get("/terms", function(req,res){
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


app.get("/privacy-policy", function(req,res){
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

app.get("/about", function(req,res){
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





// check isLoggedIn
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}



const PORT = process.env.PORT || 3000;
   app.listen(PORT || process.env.Port , function () {
  console.log('Server is started on http://localhost:'+PORT);
 });


