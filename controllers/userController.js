import { SECRET } from "../config/env.js";
import { User } from "../models/userModel.js";
import { loginSchema, userSchema } from "../schemas/userSchema.js";
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
        const userFinder = await    User.findOne({ email })
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
        return res.status(200).json({ message: 'Login Successful🎉',user,token });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    };
};