require('dotenv').config();

module.exports = {
    mongoURI: process.env.MONGODB_ORDER_URI || 'mongodb://localhost/orders',
    rabbitMQURI: 'amqp://127.0.0.1:5672',
    rabbitMQQueue: 'orders',
    port: 3002
};
