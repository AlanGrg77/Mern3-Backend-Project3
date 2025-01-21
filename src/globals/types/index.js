"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = exports.PaymentMethod = exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Preparation"] = "preparation";
    OrderStatus["Ontheway"] = "ontheway";
    OrderStatus["Delivered"] = "delivered";
    OrderStatus["Pending"] = "pending";
    OrderStatus["Cancelled"] = "cancelled";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["Khalti"] = "khanti";
    PaymentMethod["Eswa"] = "esewa";
    PaymentMethod["COD"] = "cod";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["Paid"] = "paid";
    PaymentStatus["Unpaid"] = "unpaid";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
