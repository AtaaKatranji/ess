const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

exports.authenticateToken = (req, res, next) => {
  //const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>
  const token = req.cookies.token;
  console.log(token)
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.adminId = decoded._id; // Attach user info
    next();
  });
};
