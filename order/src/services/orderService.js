const Order = require("../models/order");
const OrdersRepository = require("../repositories/orderRepository");
// const dayjs = require('dayjs')
/**
 * Class that ties together the business logic and the data access layer
 */
class OrdersService {
    constructor() {
        this.ordersRepository = new OrdersRepository();
    }

    async createOrder(order) {

        const countOrders = await this.checkOrderLimit(order.username);

        console.log(countOrders)

        if (countOrders > 5) return null;

        const createdOrder = await this.ordersRepository.create(order);

        return createdOrder;
    }

    async getOrderById(orderId) {
        const order = await this.ordersRepository.findById(orderId);
        return order;
    }


    async checkOrderLimit(username) {
        // const currentDay = new Date();
        const targetDate = new Date(); // ngày bạn muốn so sánh
        const orders = await this.ordersRepository.findByUsername(username);
        const orderToday = orders.filter(row => {
            const dateOr = new Date(row.createdAt);
            const dateOnly = new Date(dateOr.getFullYear(), dateOr.getMonth(), dateOr.getDay())
            const today = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDay());
            return today.getTime() == dateOnly.getTime();
        })
        return orderToday.length;
    }

    async getOrders() {
        const orders = await this.ordersRepository.findAll();
        return orders;
    }



}

module.exports = OrdersService;
