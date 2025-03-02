import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";
// const nodemailer = require('nodemailer'); // CommonJS style
import nodemailer from 'nodemailer';
import twilio from "twilio";
// Function to send an email
const sendEmail = async (email, name) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
    port: 465,
    secure: true,
      auth: {
        user: 'malikarmane5@gmail.com',
        pass: 'rfidszxpkvepycpx', // Set this in your .env file
      },
    });

    const mailOptions = {
      from: 'waseempaliwala@gmail.com',
      to: 'udpquiz@gmail.com',
      subject: "Welcome to Our App!",
      text: `Hi ${name}, welcome to our app! We're excited to have you on board`,
      html: `<h1>Hi ${name},</h1><p>Welcome to our app! We're excited to have you on board.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

const client = twilio(
  'ACe8f65b687d3263f28d84098384ad36c1', 
  'd9028ab5eb7f68f384b41289bca560af'
);

const sendSMS = async (name) => {
  try {
    const formattedNumber = +918154933447;

    const response = await client.messages.create({
      body: `Hello ${name}, welcome to Job Portal App!`,
      from: +17813680425,
      to: formattedNumber,
    });

    console.log("✅ SMS sent successfully:", response.sid);
  } catch (error) {
    console.error("❌ Error sending SMS:", error.message);
  }
};


export const register = catchAsyncErrors(async (req, res, next) => {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !phone || !password || !role) {
        return next(new ErrorHandler("Please fill full form!"));
    }
    const isEmail = await User.findOne({ email });
    if (isEmail) {
        return next(new ErrorHandler("Email already registered!"));
    }
    const user = await User.create({
        name,
        email,
        phone,
        password,
        role,
    });
    // try {
    //   console.log("Sending email and SMS...");
    //     await sendEmail(email, name);
    //     await sendSMS(name);
    // } catch (error) {
    //     console.error("❌ Error sending email or SMS:", error);
    //   }
    sendToken(user, 201, res, "User Registered!");
});

export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return next(new ErrorHandler("Please provide email ,password and role."));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Email Or Password.", 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email Or Password.", 400));
    }
    if (user.role !== role) {
        return next(
            new ErrorHandler(`User with provided email and ${role} not found!`, 400)
        );
    }
    // try {
    //   console.log("Sending email and SMS...");
    //     await sendEmail(email, 'Ammar');
    //     // await sendSMS('Ammar');
    // } catch (error) {
    //     console.error("❌ Error sending email or SMS:", error);
    //   }
    sendToken(user, 201, res, "User Logged In!");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
    res
        .status(201)
        .cookie("token", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
        })
        .json({
            success: true,
            message: "Logged Out Successfully.",
        });
});

export const getUser = catchAsyncErrors((req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});

// --- Admin User Management --- (No Role-Based Auth Anymore)

// Admin - Get All Users
export const adminGetAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find(); // Fetch all users
    res.status(200).json({
        success: true,
        users,
    });
});

// Admin - Delete User
export const adminDeleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler("User not found!", 404));
    }
    await user.deleteOne();
    res.status(200).json({
        success: true,
        message: "User Deleted Successfully!",
    });
});

export const updateUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone, role } = req.body; // Include role in allowed updates

  let user = await User.findById(id);
  if (!user) {
      return next(new ErrorHandler("User not found.", 404));
  }

  // Update fields - you can choose which fields are allowed to be updated by admin
  user.name = name || user.name;
  user.email = email || user.email;
  user.phone = phone || user.phone;
  user.role = role || user.role; // Allow admin to update role

  await user.save({ validateBeforeSave: true }); // Re-validate before saving

  res.status(200).json({
      success: true,
      message: "User Updated Successfully!",
  });
});