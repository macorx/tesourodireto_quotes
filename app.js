
var request =  require('request');
var cheerio = require('cheerio');
var nodemailer = require('nodemailer');
var config = require('./config');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.email.user,
        pass: config.email.pass
    }
});

var tesouroDiretoUrl = 'http://www.tesouro.fazen2da.gov.br/tesouro-direto-precos-e-taxas-dos-titulos';


request(tesouroDiretoUrl, function(error, response, body) {
    if (error) {
        sendEmail("It's not possible to retrieve tesouro direto quotes:" + error)
    } else {
        var quotesHtmlTag = 'div#p_p_id_precosetaxas_WAR_tesourodiretoportlet_';
        var $ = cheerio.load(response.body);
        var tesouroDiretoElement = $(quotesHtmlTag).html();
        sendEmail(tesouroDiretoElement);
    }

    function sendEmail(content) {
        var mailOptions = {
            from: config.sendFrom,
            to: config.sendTo,
            subject: 'Tesouro direto daily quotes',
            html: content
        };
         
    
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent:' + info.response);
            }
        });
    } 
});

