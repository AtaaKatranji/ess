const Admin = require('../models/admin'); // Adjust the path if necessary
const bcrypt = require('bcrypt');
const UserServices = require('../services/user_services');
import { serialize } from 'cookie';
// Create (Save) - Register a new admin
exports.createAdmin = async (req, res) => {
  try {
    const { name, phoneNumber, password } = req.body;

    // Check if the admin with the phone number already exists
    const existingAdmin = await Admin.findOne({ phoneNumber });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this phone number already exists' });
    }

    // Create a new admin
    const newAdmin = new Admin({
      name,
      phoneNumber,
      password, // Password hashing will happen in the schema pre-save hook
    });

    await newAdmin.save();
    return res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Retrieve (Get) - Get admin by ID
exports.getAdminById = async (req, res) => {
  try {
    const adminId = req.params.id;
    const admin = await Admin.findById(adminId);
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    return res.status(200).json(admin);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update - Update admin details
exports.updateAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;
    const { name, phoneNumber } = req.body;
    
    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      {
        name,
        phoneNumber,
        updatedAt: Date.now(), // Update the `updatedAt` timestamp
      },
      { new: true }
    );
    
    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    return res.status(200).json({ message: 'Admin updated successfully', admin: updatedAdmin });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete - Remove admin by ID
exports.deleteAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;
    
    const deletedAdmin = await Admin.findByIdAndDelete(adminId);
    
    if (!deletedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    return res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Sign In - Authenticate admin
exports.signIn = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ phoneNumber });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid phone number or password' });
    }

    // Compare the password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid phone number or password' });
    }

    let tokenData;
        tokenData = { _id: admin._id, phoneNumber: admin.phoneNumber,name:admin.name };
    

        token = await UserServices.generateAccessToken(tokenData,process.env.JWT_SECRET,"1h")
        res.setHeader('Set-Cookie', serialize('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Ensure it's only secure in production
          sameSite: 'strict',
          maxAge: 60 * 60 * 24, // 1 day expiration
          path: '/',
        }));
    
        return  res.status(200).json({ message: 'Login successful' });
    // If authentication is successful, respond with a success message (or JWT if needed)
     //res.status(200).json({ message: 'Sign in successful', admin , token});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Method Not Allowed' });
  }
};

// Function to check if an admin ID exists
exports.isValidAdminId = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId); 
    console.log("this isValid ",admin)// Check if admin exists by ID
    return admin !== null; // Return true if admin exists, false otherwise
  } catch (error) {
    console.error('Error checking admin ID:', error);
    return false; // Return false in case of an error
  }
};
