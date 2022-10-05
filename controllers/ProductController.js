const Company  = require('../src/companies/company.entity');

//Show products
const index = (req, res, next)=>{
    Company.find()
    .then(response =>{
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'An error occured!'
        })
    })
}

    

const show = (req, res, next) =>{
    let Id = req.body.Id
    Company.findById(Id)
    .then(response =>{
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'An error occured!'
        })
        
    })
}

const search = {
    get: function (req, res) {
       var query = {};
      
       if(req.query.imgQuery){
         query.Skills = { "$regex": req.query.imgQuery, "$options": "i" }
       }
   
       Company.find(query, function(err, result) {
           if (err) {
               console.log('Not a Valid Search');
               res.status(500).send(err, 'Not a Valid Search');
           }else {
               res.json(result);
           }            
       });
    }
 };

module.exports = {
    index, show, search
}