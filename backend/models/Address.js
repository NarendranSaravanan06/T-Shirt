const mongoose = require('mongoose');

const deliveryTypes = ['home', 'work', 'other'];
const nonDeliveryTypes = ['billing', 'shipping'];

const AddressSchema = new mongoose.Schema({
    userId: { type: Number, required: true, unique: true }, // Custom userId

    addresses: [{
        addressType: { 
            type: String, 
            required: true, 
            trim: true,
            validate: {
                validator: function(value) {
                    return [...deliveryTypes, ...nonDeliveryTypes].includes(value);
                },
                message: props => `${props.value} is not a valid address type`
            }
        },
        isDelivery: { type: Boolean, default: false }, // If true, only home/work/other allowed
        flatNumber: { type: String, required: true },
        line1: { type: String, required: true },
        line2: { type: String },
        line3: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { 
            type: String, 
            required: true, 
            match: [/^\d{6}$/, "Pincode must be exactly 6 digits"] 
        }
        
    }]
}, { timestamps: true });

const Address = mongoose.model('Address', AddressSchema);
module.exports = { Address, deliveryTypes, nonDeliveryTypes };
