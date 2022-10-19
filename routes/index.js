

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