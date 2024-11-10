import mongoose, { Schema, model } from "mongoose";

const installmentSchema = new Schema({
  installmentNumber: { type: Number, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
});

const orderSchema = new Schema({
  userId: {
    type: Schema.ObjectId,
    required: true,
    ref: 'user'
  },
  cartItems: [object],
  shippingAddress: {
    street: String,
    city: String,
    phone: Number
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash'],
    default: 'cash'
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  Installments: [installmentSchema], // Array of installment objects
  paidAt: Date,
  deliveredAt: Date
});

export const orderModel = model('order', orderSchema);
