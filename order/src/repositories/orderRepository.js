const mongoose = require("mongoose");
const Order = require('../models/order');

// const orderSchema = new mongoose.Schema({
//     products: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'products',
//         required: true,
//     }],
//     totalPrice: {
//         type: Number,
//         required: true,
//         min: 0,
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
// }, { collection: 'orders' });

// const Order = mongoose.model('Order', orderSchema);

class OrdersRepository {
    async create(order) {
        const createdOrder = await Order.create(order);
        return createdOrder.toObject();
    }

    async findById(orderId) {
        const order = await Order.findById(orderId).lean();
        return order;
    }

    async findByUsername(username) {
        // console.log(...obj)
        const orders = await Order.find({ username: username });
        return orders;
    }

    async findAll() {
        const orders = await Order.find().lean();
        return orders;
    }

    // async findByOrther2(...obj) {
    //     console.log(...obj)
    //     const orders = await Order.find(...obj);
    //     return orders;

    // }
}

module.exports = OrdersRepository;
