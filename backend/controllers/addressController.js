const { Address, deliveryTypes, nonDeliveryTypes } = require("../models/Address");
const User=require('../models/User')
const addAddress = async (req, res) => {
    const { userId, address } = req.body;

    // Ensure valid address type
    if (!deliveryTypes.includes(address.addressType) && !nonDeliveryTypes.includes(address.addressType)) {
        return res.status(400).json({ error: "Invalid address type" });
    }

    // If it's a delivery address, restrict to home/work/other
    if (address.isDelivery && !deliveryTypes.includes(address.addressType)) {
        return res.status(400).json({ error: "Delivery address can only be home, work, or other" });
    }

    try {
        let user=await User.findOne({userId})
        if(!user){
            res.status(404).json({ error: "No User found"});
            return
        }
        let userAddress = await Address.findOne({ userId });

        if (!userAddress) {
            userAddress = new Address({ userId, addresses: [address] });
        } else {
            userAddress.addresses.push(address);
        }

        await userAddress.save();
        res.status(201).json(userAddress);
    } catch (error) {
        console.error("Error adding address:", error);  // Logs the real issue
        res.status(500).json({ error: "Server Error", details: error.message });
    }

};
module.exports = { addAddress }