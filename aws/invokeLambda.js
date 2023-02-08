const AWS = require('aws-sdk');
const config = require('./config/aws-config');

const lambda = new AWS.Lambda({
    region: process.env.REGION
});

async function getData (event){
    const params = {
        FunctionName: 'getUserAndOrder',
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(event)
    };

    try{
        const data = await lambda.invoke(params).promise();
        const response = JSON.parse(data.Payload);
        return response;
    } catch (err) {
        console.log(err);
    }
}

async function getAllData (event){
    const params = {
        FunctionName: 'getAllUsersAndOrders',
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(event)
    };

    try{
        const data = await lambda.invoke(params).promise();
        const response = JSON.parse(data.Payload);
        return response;
    } catch (err) {
        console.log(err);
    }
}

module.exports = { getData, getAllData };
