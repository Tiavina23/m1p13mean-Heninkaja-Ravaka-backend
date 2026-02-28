const jwt = require('jsonwebtoken');

function authMiddleware(req,res,next){
  const token = req.headers.authorization?.split(' ')[1];
  if(!token) return res.status(401).json({ message:'Non autorisé' });

  try{
    const decoded = jwt.verify(token, 'SECRET_KEY'); // même secret que login
    req.user = decoded; // { id, role }
    next();
  } catch(err){
    res.status(401).json({ message:'Token invalide' });
  }
}

module.exports = authMiddleware;