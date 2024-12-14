const Subscription = require('../models/Subscription');

exports.saveSubscription = async (req, res) => {
    try {
        const subscription = req.body;
        const newSubscription = new Subscription(subscription);
        await newSubscription.save();

        res.status(201).json({ message: 'Subscription saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to save subscription', error: error.message });
    }
};
