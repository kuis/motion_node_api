var express = require('express');
var router = express.Router();
var nodemailer = require("nodemailer");
var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');

var smtpTransport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
      user: "winewater301@gmail.com",
      pass: "kuiskuis221."
  }
});

var templatesDir = path.resolve(__dirname, '..', 'views');

var email = new EmailTemplate(path.join(templatesDir, 'welcome-email'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/send', function(req, res, next) {

  var mailOptions={
    to : req.body.to,
    subject : req.body.subject,
    text : req.body.text
  };

  console.log(mailOptions);

  email.render(mailOptions, function (err, result) {
    // result.html
    // result.text
    if (err) {
      return console.error(err)
    }

    mailOptions = Object.assign(mailOptions, {html: result.html});

    smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
        console.log(error);
        res.json(error);
      } else{
        console.log("Message sent: " + response.message);
        res.json({
          message: "Message sent successfully",
          response: response
        });
      }
    });
  })
});

module.exports = router;
