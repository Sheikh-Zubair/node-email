const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');

// port 
const PORT = process.env.PORT || 5000;

// app
const app = express();

// view engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//public folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// middleware body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//get request
app.get('/', (req, res) => {
    res.render('form');
});

//post request
app.post('/form/action', (req, res) => {
    console.log(req.body);
    const output = `
        <p>You have a new form submission</p>
        <h3>Form details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
            <li>Subject: ${req.body.subject}</li>
        </ul>
        <div><h4>Megssage<h4><br> <p>${req.body.message}</p></div>
    `;


    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'talhahashim532@gmail.com',//'student_test@zoho.com',//'671404969', // generated ethereal user
            pass: 'lopilopilopi' // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: `"Node App" <talhahashim532@gmail.com>`, // sender address
        to: 'sheikhzubair998@gmail.com', // list of receivers, yes can send to multiple person
        subject: `Testing app`, // Subject line
        text: `Hi!`, // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        res.render('form', {msg:'Email sent'});
    });
});

// listening on port 5000
app.listen(PORT, () => {
    console.log(` Server started on port: ${PORT}`);
});