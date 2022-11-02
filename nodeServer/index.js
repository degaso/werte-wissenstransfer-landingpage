var express = require("express");
var cors = require('cors');
var expressApp = express();
var bodyParser = require('body-parser')
var http = require('http');
var https = require('https');
const port = 8989;
const puppeteer = require('puppeteer');
const sendmail = require('sendmail')();

expressApp.use(bodyParser.json({
    limit: '50mb'
}));

expressApp.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true
}));

expressApp.use(cors());

const httpServer = http.createServer(expressApp);
httpServer.listen(port, () => {
    console.log('HTTP Server running on port '+ port);
    expressApp.use(express.static('./assets'))
});

try {
    const httpsServer = https.createServer({
        key: fs.readFileSync('/etc/letsencrypt/live/blank42.de/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/blank42.de/fullchain.pem'),
    }, app);
    httpsServer.listen(port, () => {
        console.log('HTTPS Server running on port '+ port);
    });
} catch (error) {
    console.log('no ssl available')
}

expressApp.post('/sendAccount', function (req, res, next) {
    sendAccount(req.body.firstName, req.body.lastName, req.body.email, req.body.company)
    res.sendStatus(200);
})

async function sendAccount(firstName, lastName, email, company) {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.goto('https://werte-wissenstransfer.de/anmeldung/');
    await page.type('#form-field-first_name', firstName);
    await page.type('#form-field-last_name', lastName);
    await page.type('#form-field-email', email);
    await page.type('#form-field-field_1410b80', company);
    await page.click('#form-field-datenschutz')
    // await page.click("button[type=submit]");
    await browser.close();
    console.log('done');

    sendmail({
        from: 'noreply@degaso.de',
        to: 'valentin.kummert@gmail.com',
        subject: 'Neue Anmeldung bei Werte-Wissenstransfer',
        html: 'Es gab eine neue Anmeldung über die Landingpage! <br><br>'+firstName+'<br>'+lastName+'<br>'+email+'<br>'+company+'<br>',
    }, function (err, reply) {
        console.log(err && err.stack);
        console.dir(reply);
    });
}