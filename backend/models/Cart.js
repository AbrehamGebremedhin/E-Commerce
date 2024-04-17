const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['Active', 'Cancelled', 'Bought'],
        default: 'Active',
        required: [true]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
},{
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
});

module.exports = mongoose.model('Cart', CartSchema);