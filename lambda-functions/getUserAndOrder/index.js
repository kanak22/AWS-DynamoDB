require('dotenv').config();
const AWS = require('aws-sdk');

AWS.config.update({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

const dynamodb = new AWS.DynamoDB({
    region: process.env.REGION,
    apiVersion: '2012-08-10',
});

exports.handler = async (event) => {

    try {
        const usersData = await dynamodb.query({
            TableName: "UserDetails",
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: {
                ':id': {
                    S: event.id
                },
            },
        }).promise();

        const orderData = await dynamodb.scan({
            TableName: "OrderDetails",
        }).promise();

        const user = usersData.Items[0];
        const orders = orderData.Items;
        const userOrders = orders.filter(order => order.user_id.S === user.user_id.S);

        const orderResponse = userOrders.map(order => {
            return {
                id: order.order_id.N,
                name: order.order_name.S,
                price: order.order_price.S,
            }
        });

        const response = {
            id: user.user_id.S,
            name: user.name.S,
            email: user.email.S,
            orders: orderResponse,
        }

        return response;
    } catch (err) {
        console.log(err);
        return err;
    }
};