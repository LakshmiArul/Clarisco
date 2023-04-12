const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Register a user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400).json({status:"400 error", message: "All fields are mandatory"});
    throw new Error("All fields are mandatory!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400).json({status:"400 error", message: "User already registered"});
    throw new Error("User already registered!");
  }

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password: ", hashedPassword);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({status: "success", message: "user registered successfully", _id: user.id, email: user.email });
  } else {
    res.status(400).json({status:"400 error", message: "User data not valid"});
    throw new Error("User data not valid");
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({status:"400 error", message: "All fields are mandatory"});
    throw new Error ("All fields are mandatory");
  }
  const user = await User.findOne({ email });
  //compare password with hashedpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401).json({status:"401 error", message: "email or password is not valid"});
    throw new Error ("email or password is not valid")
  }
};

const currentUser = async (req, res) => {
  res.json(req.user);
};

module.exports = { registerUser, loginUser, currentUser };
