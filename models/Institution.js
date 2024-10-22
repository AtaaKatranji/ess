const mongoose = require('mongoose');
const { generateSlug } = require('../middleware/institutionMiddleware');

const InstitutionSchema = new mongoose.Schema({
  adminId: {type: mongoose.Schema.Types.ObjectId, required:true, ref: 'Admin'},
  name: { type: String, required: true },
  address: { type: String, required: true },
  uniqueKey: { type: String, required: true },
  macAddresses: [
    {
      wifiName: { type: String, required: true },
      macAddress: { type: String, required: true }
    }
  ],
  image: { type: String },
  slug:  { type: String, unique: true },
});
InstitutionSchema.pre('save', generateSlug); 
module.exports = mongoose.model('Institution', InstitutionSchema);
