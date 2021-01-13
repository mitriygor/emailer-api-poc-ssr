import express from "express";
import compression from "compression";
import index from "./routes/index";
import path from "path";
import fetch from "node-fetch";
import ejs from 'ejs';
import emailers from '../data/emailers.json';
import fs from 'fs';
import bodyParser from 'body-parser';

// Server var
const app = express();
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false})

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(compression());

app.use(express.static(__dirname + "/public"));

//Routes
app.use("/", index);

const port = process.env.PORT || 3000;

app.listen(port, function listenHandler() {
    console.info(`Running on ${port}`)
});

// Endpoint for cron job which is supposed to trigger request for fetching data (i.e. color, site id) for the email template
// in the response, there is supposed too be stringify email template with populated data
app.post('/cron-job-endpoint', (req, res) => {
    fetch('https://jsonplaceholder.typicode.com/todos/1', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        }
    })
        .then(response => {
            if (response.status !== 200) {
                res.status(response.status)
                res.send(err);
            } else {
                response.json().then((data) => {

                    ejs.renderFile('./email-templates/template.ejs', {
                        color: data.id,
                        site: data.title,
                        sites: ['Pic One', 'Pic Two', 'Pic Three', 'Pic Four']
                    }, {}, (err, str) => {
                        console.log('err', err);
                        console.log('str', str);
                        if (!!str) {
                            res.status(200)
                            res.send(str);
                        } else {
                            res.status(500)
                            res.send(err);
                        }
                    })
                });
            }
        })
        .catch((err) => {
            res.status(500)
            res.send(err);
        });
});

// The same method as above, but which taskes data from locally preserved data (i.e. frm json file)
app.post('/cron-job-endpoint-with-local-file', (req, res) => {
    let emailsArray = [];
    emailers.data.forEach(emailer => {
        return ejs.renderFile('./email-templates/template.ejs', {
            color: emailer.color,
            site: emailer.site
        }, {}, (err, str) => {
            emailsArray.push(str);
        })
    });
    res.send(emailsArray.toString());
});

// The method creates a new emailer and saves it in the json file as an example of temporary store
app.post('/create-emailer', urlencodedParser, (req, res) => {
    fs.readFile('./data/emailers.json', (err, data) => {


        const newEmailer = {
            site: req.body.site,
            color: req.body.color
        };


        const json = JSON.parse(data);



        json.data.unshift(newEmailer);



        const strJson = JSON.stringify(json);


        fs.writeFile("./data/emailers.json", strJson, (err, result) => {
            if (err) {
                res.status(500)
                res.send(err);
            } else {
                res.status(200)
                res.send(strJson);
            }
        })
    })
});