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

//Calculate total cart Price
ItemSchema.statics.getTotalPrice = async function (cartId) {
    const obj = await this.aggregate([
        {
            $match: { cart: cartId }
        },
        {
            $lookup: {
                from: 'products', // Name of the Product collection
                localField: 'product',
                foreignField: '_id',
                as: 'product'
            }
        },
        {
            $unwind: '$product'
        },
        {
            $group: {
                _id: '$cart',
                totalPrice: { 
                    $sum: { 
                        $multiply: 
                        [
                            '$product.Price', '$quantity'
                        ] 
                    } 
                }
            }
        }
    ]);

    try {
        await mongoose.model('Cart').findByIdAndUpdate(cartId, {
            totalPrice: obj[0].totalPrice
        });
    } catch (err) {
        console.log(err);
    }
};


// Call getTotalPrice after saving an item
ItemSchema.post('save', async function () {
    await this.constructor.getTotalPrice(this.cart);
});

// Call getTotalPrice before deleting an item
ItemSchema.pre('deleteOne', async function (next) {
    await this.constructor.getTotalPrice(this.cart);
    next();
});

module.exports = mongoose.model('Item', ItemSchema);