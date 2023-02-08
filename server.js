require('dotenv').config();
const express = require('express');
const routes = require('./routes/routes');
const config = require('./aws/config/aws-config');

const app = express();
app.use(express.json());         
app.use(express.urlencoded({extended: true}));    

app.use('/', routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});