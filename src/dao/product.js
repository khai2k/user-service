import ProductModel from '../models/product'
const product = {
  async createUser({ brand, name, price ,image,countInStock}) {
    let result = await ProductModel.create({
      brand,
      name,
      price,
      image,
      countInStock
    })
    console.log(result, 'resultresultresultresult')
    return result
  
  },
  async readUser(query) {
    let result = await ProductModel.findById(query)
    return result
  },
  async readallUser()
  {
    let result= await ProductModel.find({})
    return result
  },
  async updateUser(data, query) {
    let result = await ProductModel.findOneAndUpdate({ _id: query }, data)
  },
  async deleteUser(query) {
    let result = await ProductModel.findOneAndRemove({ _id: query })
  }
}

export default product
