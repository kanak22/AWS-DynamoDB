const router = require("express").Router();
const { getData, getAllData } = require("../aws/invokeLambda.js");
const {UserDetailsTable} = require("../aws/UserDetails.js");
const {OrderDetailsTable} = require("../aws/OrderDetails.js");

router.get('/', (req, res) => {
    res.send('Hello World Testing!');
});

router.post('/createTables', async (req, res) => {
    try{
        const data = await UserDetailsTable();
        const data2 = await OrderDetailsTable();
        res.send('DynamoDB tables created');
    } catch (err) {
        console.log(err);
    }
});

router.get('/getData', async (req, res) => {

    if (!req.query) {
        res.send('Please pass id in request query params');
        return;
    }

    if (!req.query.id) {
        res.send('Please pass id in request query params');
        return;
    }

    try{
        const data = await getData({ id: req.query.id});
        res.send(data);

    } catch (err) {
        console.log(err);
    }
});

router.get('/getAllData', async (req, res) => {

    try{
        const data = await getAllData({});
        res.send(data);
    } catch (err) {
        console.log(err);
    }
});


module.exports = router;