const userModel = require("../models/user.model");
const tokenBlacklistModel = require("../models/blacklists.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUsercontroller(req, res) {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    return res.status(400).json({
      message: "Please provide all details",
    });
  }
  const isUserAlredyExits = await userModel.findOne({
    $or: [{ userName }, { email }],
  });
  if (isUserAlredyExits) {
    return res.status(400).json({
      message: "Account Alredy Exits with same username or email",
    });
  }

  const hashpassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    userName,
    email,
    password: hashpassword,
  });
  const token = jwt.sign(
    { id: user._id, userName: user.userName },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" },
  );
  res.cookie("token", token);
  res.status(200).json({
    message: "user Created Sucessfully",
    user: {
      id: user._id,
      userName: user.userName,
      email: user.email,
    },
  });
}

async function loginUserController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "invalid email and password",
    });
  }

  const isPassValid = await bcrypt.compare(password, user.password);

  if (!isPassValid) {
    return res.status(400).json({
      message: "invalid email and password",
    });
  }

  const token = jwt.sign(
    { id: user._id, userName: user.userName },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);
  res.status(200).json({
    message: "user loggedin sucessfully",
    user: {
      id: user._id,
      userName: user.userName,
      email: user.email,
    },
  });
}

async function logoutUserController(req, res) {
  const token = req.cookies.token;

  if (token) {
    await tokenBlacklistModel.create({ token });
  }

  res.clearCookie("token");
  res.status(200).json({
    message: "User Logged Out sucessfully",
  });
}

async function getMeController(req, res) {
  const user = await userModel.findById(req.user.id);
  res.status(200).json({
    message:"fetch Data sucessfully",
    user:{
      id:user._id,
      userName:user.userName,
      email:user.email
    }
  })
}

module.exports = {
  registerUsercontroller,
  loginUserController,
  logoutUserController,
  getMeController,
};
