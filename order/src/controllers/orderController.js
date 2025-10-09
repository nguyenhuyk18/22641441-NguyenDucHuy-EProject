const OrderServices = require('../services/orderService');

class OrderController {
    constructor() {
        this.getAllOrder = this.getAllOrder.bind(this);
        this.orderServices = new OrderServices();
    }

    getAllOrder = (req, res, next) => {
        try {
            const allOrders = this.orderServices.getOrders();
            res.status(200).json(allOrders);
            return;
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi đã xảy ra thử lại sau !!!' });
            return;
        }
    }



}

module.exports = OrderController;