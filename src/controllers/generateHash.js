const bcrypt = require('bcryptjs');

const hash = bcrypt.hashSync("1234", 8);
console.log(hash);




db.users.insertOne({
  name: "Admin",
  email: "admin@gmail.com",
  password: "$2b$08$0pBtIRtCa3l8sFJlm8yLweBZZB3lozU1FEhkdkYtTvWE/GhlTLvee",
  role: "admin",
  isActive: true,
  createdAt: new Date()
})