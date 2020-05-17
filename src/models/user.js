var mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})
const user = mongoose.model('User', UserSchema)

export default user
