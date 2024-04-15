const mongoose = require('mongoose')
const slugify = require('slugify')

const InventorySchema = new mongoose.Schema({
    Type:  { type: String, required: [true, 'A type for this inventory is required']},
    boughtPrice: {type: Number ,required: [true, 'A buying price for this inventory is required']},
    availableQuantity: {type: Number},
    createdAt: {
        type: Date,
        default: Date.now()
    },
},{
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
})

InventorySchema.pre('save', function (next) {
    this.slug = slugify(this.Type, { lower: true });
    next();
});

module.exports = mongoose.model('Inventory', InventorySchema);