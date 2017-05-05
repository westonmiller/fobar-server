import mongoose from 'mongoose';

const Schema = mongoose.Schema

const orderSchema = new Schema({
  dateSubmitted: String,
  customerName: String,
  notes: String,
  phoneNumber: Number,
  quantity: Number,
  notes: String,
  finishedDate: String,
  recipeID: String,
});

orderSchema.pre('save', function(next) {
  console.log('This ', this)
  this.dateSubmitted = new Date()
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;