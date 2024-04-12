const mongoose = require('mongoose')
const slugify = require('slugify')

const ProductSchema = new mongoose.Schema({
    Color:  { type: String, required: [true, 'A color for the product is required'] },
    Type:  { type: String, required: [true, 'A type for the product is required']},
    Size: { type: String, enum: ['Small', 'Medium', 'Large'], required: [true, 'A size for the product is required']},
    Price: {type: Number ,required: [true, 'A price for the product is required']},
    Image: {type: String,  default:'no-image.jpg'},
    availableQuantity: {type: Number},
    createdAt: {
        type: Date,
        default: Date.now()
    },
},{
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
})

ProductSchema.pre('save', function (next) {
    this.slug = slugify(this.Type, { lower: true });
    next();
});

module.exports = mongoose.model('Product', ProductSchema);