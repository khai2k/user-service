import number from 'joi/lib/types/number'

var mongoose = require('mongoose')

var ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image:{
    type:String
  },
  countInStock: {
    type: Number,
    required: true
  }
})
const Product = mongoose.model('Product',ProductSchema)

export default Product
