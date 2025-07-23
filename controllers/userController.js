import { SECRET } from "../config/env.js";
import { User } from "../models/userModel.js";
import { changePasswordSchema, loginSchema, userSchema } from "../schemas/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const signUp = async (req, res) => {
    try {
        // validation
        const { error, value } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }

        const { email, password } = value;
        // check if account exist by email, if not continue with the registration by hashing the password
        const userFinder = await User.findOne({ email })
        if (userFinder) {
            return res.status(400).json({ message: `User with this Email:${email} already exist` })
        } else {
            // hash password
            const hashPassword = await bcrypt.hash(password, 12);
            console.log('HashPassword', hashPassword)

            // otp for verification of mail
            // const otp = otpGenerator(4)
            // const hashotp = await bcrypt.hash(otp, 12);
            // console.log("hashotp", hashotp, otp)

            // save the new user details in the database using the format below.
            const createAccount = await User.create({
                ...value,
                password: hashPassword,
                // otp: hashotp,
                // otpExpiresAt: Date.now() + 300000
            });
            console.log('New Account', createAccount)
            // send mail
            // const sendotpmail = await sendOtpEmail(email, otp);
            // console.log('OTP MAIL', sendotpmail)
            // generate token to the user
            // const token = jwt.sign(
            //     { id: createAccount.id },
            //     SECRET,
            //     { expiresIn: '1d' }
            // );
            return res.status(200).json({ message: 'User Register Successfully🎉', createAccount })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
};


export const login = async (req, res) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        };

        const { email, password } = value;
        // check if account exist by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: `Invalid Credentials` })
        };
        // if (!user.isVerified) {
        //     return res.status(400).json({ message: 'Account not verified' });
        // }
        // lets compare the password to the hashPassword in the db
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid Credentials' })
        };
        // generate token to the user
        const token = jwt.sign(
            { id: user.id },
            SECRET,
            { expiresIn: '1d' }
        );
        return res.status(200).json({ message: 'Login Successful🎉', user, token });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    };
};


// logoutController.js
export const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'Strict',
            secure: process.env.NODE_ENV === 'production',
        });
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Logout failed', error: error.message });
    }
};


export const userProfile = async (req, res) => {
    try {
        const { userID } = req.body
        const findUser = await User.findById(userID)
        if (!findUser) {
            return res.status(400).json({ message: 'User does not exist' })
        }
        return res.status(200).json({ message: 'User', findUser })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const userid = req.user.id
        if (!userid) {
            return res.status(400).json({ message: 'User not found' })
        }
        const { userID } = req.body
        const updateUser = await User.findByIdAndUpdate(
            userid,
            req.body,
            { new: true }
        )
        if (!updateUser) {
            return res.status(400).json({ message: 'User does not exist' })
        }
        return res.status(200).json({ message: 'User', updateUser })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const changePassword = async (req, res) => {
  try {
    const userID = req.user.id;

    const { error, value } = changePasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { oldPassword, newPassword } = value;

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ success: true, message: 'Password updated successfully' });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const alluser = async (req, res) => {
    try {
        const findUser = await User.find()
        if (findUser.length === 0) {
            return res.status(400).json({ message: 'No Users Available' })
        }
        return res.status(200).json({ message: 'Users', findUser })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}