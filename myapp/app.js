const express = require('express');
const bodyParser = require('body-parser');
/*knex connects to the mysql database and makes the queries*/
var knex = require('knex') ({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'usr1',
        password: 'usr1',
        database: 'assignment4'
    }
});

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req,res) => {
    res.send(`Hello there and welcome to WebDev2-assignment4: Options: <br/>
        /create to create a new entry for the city table <br/>
        /read to read the details of the city table <br/>
        /update to modify the population count of a city stored in the database <br/>
        /delete to delete a city from the database <br/>
    `);
});

app.post('/create', (req,res) => {
    knex('city').insert(req.body).then(_ => {
        knex('city').select('*').where("CountryCode",'=',req.body.CountryCode).then(data => res.send(data));
    });
});

app.get('/read', (req,res) => {
    knex('city').select('*').where(req.query).then(data => res.send(data));
});

app.patch('/update', (req,res) => {
    knex('city').where("CountryCode","=",req.body.CountryCode).update("Population",req.body.Population).then(_ => {
        knex('city').select('*').where("CountryCode",'=',req.body.CountryCode).then(data => res.send(data));
    });
});

app.delete('/delete', (req,res) => {
    knex('city').where(req.query).del().then(nrOfDeletions => {
        if (nrOfDeletions > 0) {
            res.send(true);
        } else {
            res.send(false);
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
