exports.register = async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      role: req.body.role
    });

    await user.save();
    res.status(201).send({ message: "User registered successfully!" });

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.login = async (req, res) => {

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).send({ message: "User Not found." });
  }

  const passwordIsValid = bcrypt.compareSync(
    req.body.password,
    user.password
  );

  if (!passwordIsValid) {
    return res.status(401).send({
      accessToken: null,
      message: "Invalid Password!"
    });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.SECRET,
    { expiresIn: 86400 }
  );

  res.status(200).send({
    id: user._id,
    email: user.email,
    role: user.role,
    accessToken: token
  });
};