import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        index : true
    },
    category : {
        type : String,
        required : true,
        index : true
    },
    price : {
        type : Number,
        required :true,
        index : true
    }
})

const Product = mongoose.model('products', productSchema);

export default Product;