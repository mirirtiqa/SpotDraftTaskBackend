import User from '../model/userModel.js'
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from 'uuid';
import sendEmail from '../utils/sendEmail.js';
import { ConnectionPoolClearedEvent } from 'mongodb';


export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Signup error', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid Email');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid Password');

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try{
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = uuidv4();

  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 1000 * 60 * 10; 
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/resetPassword/${token}`;

  await sendEmail({
    recepient: email,
    subject: 'Password Reset',
    text: `Click on the following link to reset your password: \n\n ${resetUrl}`,
  });

  res.status(200).json({ message: 'Password reset email sent' });
  }
  catch (err) {
    res.status(500).json({ message: 'Error sending reset email', error: err.message });
  }
};



export const resetPasswordUsingLink = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try{
    console.log("token is",token)
    console.log("password is",password)
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  console.log("user is",user)
  

  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  const hashedPassword = await bcrypt.hash(password, 10);

  if (!hashedPassword) {
    throw new Error('Could not reset password, please try again later');
  }
  console.log("has the password been hashed?")

  console.log("hashedPassword is",hashedPassword)
  user.password = hashedPassword; 
  user.resetPasswordToken = "";
  user.resetPasswordExpires = "";
  const saveduser = await user.save();
  console.log("saveduser is",saveduser)

  res.status(200).json({ message: 'Password updated successfully' });
  }
  catch (err) {
    res.status(500).json({ message: 'Error resetting password', error: err.message });
  }
};
