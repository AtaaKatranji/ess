const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

const { 
    createInstitution, 
    getInstitutionById, 
    updateInstitution, 
    deleteInstitution, 
    generateNewUniqueKey, 
    getAllInstitutions,
    getInstitutionBySlug,
    getAllAdminInstitutions,
    checkName,
    getNetworks,
 } = require('../controllers/institutionController');
const validateInstitution = require('../validators/validateInstitution');

// Routes for institution management
// Routes with :id come first
router.get('/institutions/:id', authenticateToken, getInstitutionById);
router.get('/institutionsAdmin',authenticateToken, getAllAdminInstitutions);
router.put('/institutions/:slug', authenticateToken, validateInstitution, updateInstitution);
router.delete('/institutions/:slug', authenticateToken, deleteInstitution);
router.patch('/institutions/:id/generate-key', authenticateToken, generateNewUniqueKey);

// Routes with :slug come after :id routes
router.get('/institutions/slug/:slug', authenticateToken, getInstitutionBySlug);

// Other routes
router.post('/institutions', authenticateToken, validateInstitution, createInstitution);
router.get('/institutions', authenticateToken, getAllInstitutions);
router.post('/check-name', authenticateToken, checkName);
router.post('/networks',  getNetworks);



module.exports = router;
