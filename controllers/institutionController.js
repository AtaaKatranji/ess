const { generateSlug } = require('../middleware/institutionMiddleware');
const Institution = require('../models/Institution');
const { isValidAdminId } = require('./adminController');

// Controller to create institution
exports.createInstitution = async (req, res, next) => {
  try {
    const { adminId, name, address, keyNumber, macAddresses, image } = req.body;
    const isValid = await isValidAdminId(adminId);
    
    if(!isValid){
      res.status(400).json({ message: error.message });
    }
    try{
      const institution = new Institution({ adminId, name, address, uniqueKey: keyNumber, macAddresses, image });
      const savedInstitution = await institution.save();
      res.status(201).json(savedInstitution);
    }catch{
      res.status(400).json({ message: error.message });
    }
    
  } catch (error) {
    next(error); // Pass to error handler
  }
};

// GET /ins/institutions
exports.getAllInstitutions = async (req, res) => {
    try {
      const institutions = await Institution.find();
      res.status(200).json(institutions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  // GET /ins/institutionsAdmin
  exports.getAllAdminInstitutions = async (req, res) => {
    try {
      const adminId = req.adminId; // Now coming from verifyToken middleware
      console.log('Admin ID:', adminId);
  
      const institutions = await Institution.find({ adminId }); // Filter by adminId
  
      res.setHeader('Access-Control-Allow-Origin', 'https://ess-admin-lime.vercel.app'); // Allow frontend origin
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.status(200).json(institutions); // Send the institutions as response
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
// GET /api/institutions/:id
exports.getInstitutionById = async (req, res) => {
    try {
      const institution = await Institution.findById(req.params.id);
      if (!institution) return res.status(404).json({ message: 'Institution not found' });
      res.setHeader('Access-Control-Allow-Origin', 'https://ess-admin-lime.vercel.app'); // Allow the frontend origin
      res.setHeader('Access-Control-Allow-Credentials', 'true');  
      res.status(200).json(institution);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  // GET /api/institutions/institution-slug
exports.getInstitutionBySlug = async (req, res) => {
    try {

      // Find the institution by its slug instead of its ID
      const institution = await Institution.findOne({ slug: req.params.slug });
      
      if (!institution) {
        return res.status(404).json({ message: 'Institution not found' });
      }
  
      // Return the found institution
      res.status(200).json(institution);
    } catch (error) {
      // Handle any errors
      res.status(500).json({ message: error.message });
    }
  };
  // PUT /api/institutions/:id
exports.updateInstitution = async (req, res) => {
    try {
      const { name, address, adminId, keyNumber, macAddresses, image } = req.body;
      const { slug } = req.params;
      const updatedInstitution = await Institution.findOneAndUpdate(
        {slug},
        {
          name,
          address,
          adminId: adminId,
          uniqueKey: keyNumber,
          macAddresses,
          image
        },
        { new: true }
      );
      
      if (!updatedInstitution) return res.status(404).json({ message: 'Institution not found' });
  
      res.status(200).json(updatedInstitution);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  // DELETE /api/institutions/:id
exports.deleteInstitution = async (req, res) => {
    try {
      
      const institution = await Institution.findOneAndDelete({ slug: req.params.slug });
      if (!institution) return res.status(404).json({ message: 'Institution not found' });
  
      res.status(200).json({ message: 'Institution deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
// PATCH /api/institutions/:id/generate-key
exports.generateNewUniqueKey = async (req, res) => {
    try {
      const newKey = Math.random().toString(36).substr(2, 9).toUpperCase();  // Generate a new unique key
  
      const updatedInstitution = await Institution.findByIdAndUpdate(
        req.params.id,
        { uniqueKey: newKey },
        { new: true }
      );
  
      if (!updatedInstitution) return res.status(404).json({ message: 'Institution not found' });
  
      res.status(200).json(updatedInstitution);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
exports.checkName = async (req, res) => {
    const { adminId, name } = req.body;
    console.log(req.body)
    
    try {
      // Check if the institution exists
      const institutionExists = await Institution.findOne({ adminId, name });
      
      if (institutionExists != null) {
        console.log("ins true: ",institutionExists)
        return res.json({ exists: true });
      } else {
        console.log("ins false: ",institutionExists)
        return res.json({ exists: false });
      }
    } catch (error) {
      console.error('Error checking institution name:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
exports.getNetworks = async (req, res) => {
  try {

    // Find the institution by its slug instead of its ID
    const ins = await Institution.findOne({ uniqueKey: req.body.uniqueKey });
    console.ins
    if (!ins) {
      return res.status(404).json({ message: 'Institution not found' });
    }
    const networksList = ins.macAddresses
    // Return the found institution
    res.status(200).json(networksList);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: error.message });
  }
}