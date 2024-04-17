const mongoose = require('mongoose')
const Cart = require('./Cart')

const ItemSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        default: 1,
        required: [true, "Please add a quantity for the selected Item"]
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    },
    cart: {
        type: mongoose.Schema.ObjectId,
        ref: 'Cart',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
},{
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
});


ItemSchema.pre('save', async function (next) {
    try {
        // Find the budget document for the same category and user
        const cart =  await Cart.findById(this.cart);
        if (!cart) return next(new Error("The Cart does not exist"));
        
        cart.totalPrice += Number(this.quantity * this.product.price);
        await cart.save();

        next();
    } catch (error) {
        next(error);
    }
});


module.exports = mongoose.model('Item', ItemSchema);