const AWS = require('aws-sdk');
const config = require('./config/aws-config');

const dynamodb = new AWS.DynamoDB({
    region: process.env.REGION
});

async function OrderDetailsTable(){
    const params = {
        TableName: 'OrderDetails',
        KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH' },
            { AttributeName: 'user_id', KeyType: 'RANGE' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' },
            { AttributeName: 'user_id', AttributeType: 'S' },
            { AttributeName: 'order_id', AttributeType: 'N' },
            { AttributeName: 'order_name', AttributeType: 'S' },
            { AttributeName: 'order_price', AttributeType: 'S' }
        ],
        LocalSecondaryIndexes: [
            {
                IndexName: 'order_idIndex',
                KeySchema: [
                    { AttributeName: 'id', KeyType: 'HASH' },
                    { AttributeName: 'order_id', KeyType: 'RANGE' }
                ],
                Projection: {
                    ProjectionType: 'ALL'
                }
            },
            {
                IndexName: 'order_nameIndex',
                KeySchema: [
                    { AttributeName: 'id', KeyType: 'HASH' },
                    { AttributeName: 'order_name', KeyType: 'RANGE' }
                ],
                Projection: {
                    ProjectionType: 'ALL'
                }
            },
            {
                IndexName: 'order_priceIndex',
                KeySchema: [
                    { AttributeName: 'id', KeyType: 'HASH' },
                    { AttributeName: 'order_price', KeyType: 'RANGE' }
                ],
                Projection: {
                    ProjectionType: 'ALL'
                }
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    };

    dynamodb.listTables({}, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            if(data.TableNames.includes('OrderDetails')) {
                console.log('OrderDetails already exists');
                dynamodb.updateTable(params, (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(data);
                    }
                });
                return;
            } else {
                dynamodb.createTable(params, (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(data);
                    }
                });
            }
            console.log(data);
        }
    });

};

module.exports = {OrderDetailsTable};
