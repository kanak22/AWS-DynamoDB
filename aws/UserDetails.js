const AWS = require('aws-sdk');
const config = require('./config/aws-config');

const dynamodb = new AWS.DynamoDB({
    region: process.env.REGION
});

async function UserDetailsTable(){
    const params = {
        TableName: 'UserDetails',
        KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH' },
            { AttributeName: 'user_id', KeyType: 'RANGE'}
        ],
        AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' },
            { AttributeName: 'user_id', AttributeType: 'S' },
            { AttributeName: 'name', AttributeType: 'S' },
            { AttributeName: 'email', AttributeType: 'S' }
        ],
        LocalSecondaryIndexes: [
            {
                IndexName: 'nameIndex',
                KeySchema: [
                    { AttributeName: 'id', KeyType: 'HASH' },
                    { AttributeName: 'name', KeyType: 'RANGE' }
                ],
                Projection: {
                    ProjectionType: 'ALL'
                }
            },
            {
                IndexName: 'emailIndex',
                KeySchema: [
                    { AttributeName: 'id', KeyType: 'HASH' },
                    { AttributeName: 'email', KeyType: 'RANGE' }
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
            if(data.TableNames.includes('UserDetails')) {
                console.log('UserDetails already exists');
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

module.exports = {UserDetailsTable};
