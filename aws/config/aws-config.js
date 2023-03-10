const AWS = require('aws-sdk');

const awsConfig = 
    AWS.config.update({
        region: process.env.REGION,
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    });

module.exports = awsConfig;