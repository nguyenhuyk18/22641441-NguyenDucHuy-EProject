const express = require("express");
const mongoose = require("mongoose");
const Order = require("./models/order");
const amqp = require("amqplib");
const config = require("./config");
// const dayjs = require('dayjs');
const OrderServices = require('./services/orderService');

class App {
  constructor() {
    this.app = express();
    this.connectDB();
    this.setupOrderConsumer();
    this.orderServices = new OrderServices();
  }

  async connectDB() {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  }

  async disconnectDB() {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }

  async setupOrderConsumer() {
    console.log("Connecting to RabbitMQ...");

    setTimeout(async () => {
      try {
        const amqpServer = "amqp://127.0.0.1:5672";
        const connection = await amqp.connect(amqpServer, { frameMax: 131072 });
        console.log("Connected to RabbitMQ");

        const channel = await connection.createChannel();
        await channel.assertQueue("orders");


        channel.consume("orders", async (data) => {
          // Consume messages from the order queue on buy
          // console.log("Consuming ORDER service");
          // console.log(data.content, 'test')
          const { products, username, orderId } = JSON.parse(data.content);

          // console.log(username)
          // console.log(products)
          // console.log(orderId)

          const newOrder = {
            products,
            username: username,
            totalPrice: products.reduce((acc, product) => acc + product.price, 0)
          };

          const rs23 = await this.orderServices.createOrder(newOrder)
          // console.log(rs23)
          // Save order to DB
          if (!rs23) {

            channel.ack(data);

            const { user, products: savedProducts, totalPrice } = newOrder;
            channel.sendToQueue(
              "products",
              Buffer.from(JSON.stringify({ orderId, user, products: savedProducts, totalPrice, status: 'fail' }))
            );

            return;
          }



          // Send ACK to ORDER service
          channel.ack(data);
          // console.log("Order saved to DB and ACK sent to ORDER queue");

          // Send fulfilled order to PRODUCTS service
          // Include orderId in the message
          const { user, products: savedProducts, totalPrice } = newOrder;
          channel.sendToQueue(
            "products",
            Buffer.from(JSON.stringify({ orderId, user, products: savedProducts, totalPrice, status: 'completed' }))
          );

        });
      } catch (err) {
        console.error("Failed to connect to RabbitMQ:", err.message);
      }
    }, 500); // add a delay to wait for RabbitMQ to start in docker-compose
  }



  start() {
    this.server = this.app.listen(config.port, () =>
      console.log(`Server started on port ${config.port}`)
    );
  }

  async stop() {
    await mongoose.disconnect();
    this.server.close();
    console.log("Server stopped");
  }
}

module.exports = App;
