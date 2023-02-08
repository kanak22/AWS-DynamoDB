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
  const usersParams = {
    TableName: 'UserDetails',
  };

  const orderParams = {
    TableName: 'OrderDetails',
  };

  try {
    const usersData = await dynamodb.scan(usersParams).promise();
    const orderData = await dynamodb.scan(orderParams).promise();

    const users = usersData.Items;
    const order = orderData.Items;

    const result = [];
    for (const user of users) {
      for (const orderItem of order) {
        if (user.user_id.S === orderItem.user_id.S) {
          result.push({
            id: user.user_id.S,
            name: user.name.S,
            email: user.email.S,
            order_id: parseInt(orderItem.order_id.N),
            order_name: orderItem.order_name.S,
            order_price: orderItem.order_price.S,
          });
        }
      }
    }

    result.sort((a, b) => a.id - b.id);
    return (result);
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      }),
    };
  }
};