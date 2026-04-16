const express = require('express');

// Company Routes
const companyRouter = express.Router();
const { getCompanies, getCompany, createCompany, updateCompany } = require('../controllers/companyController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
companyRouter.get('/', protect, getCompanies);
companyRouter.get('/:id', protect, getCompany);
companyRouter.post('/', protect, adminOnly, createCompany);
companyRouter.put('/:id', protect, adminOnly, updateCompany);
module.exports = companyRouter;
