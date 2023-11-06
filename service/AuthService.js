import { generate } from 'randomstring';
import UserModel from "../model/userModel.js";
import { getOne, create, updateByCondition } from '../dao/user-dao.js';
import bcryptjs from 'bcryptjs';
import { sendOTPEmail, sendForgotOTPEmail, sendResendOTPEmail } from "../utils/communication_helper.js";
import { sendMail } from "../utils/communication.js";
import { prepareUserResponse as prepareUserRes } from '../utils/utils.js';
const saltRounds = 10
import jwt from 'jsonwebtoken';

//Register (Its creating user)
export async function register(bodyData) {
    return new Promise( async(resolve,reject) => {
        try {
            if (!bodyData.fullName) {
                return reject({ message: "Please enter fullname !!" });
            }

            if (!bodyData.phoneNumber) {
                return reject({ message: "Please enter phone number !!" });
            }

            if (!bodyData.email) {
                return reject({ message: "Please enter email !!" });
            }

            if (!bodyData.password) {
                return reject({ message: "Please enter password !!" });
            }

            let role = (bodyData.role|| 'MEMBER').toUpperCase();
            const userData = {
                fullName: bodyData.fullName,
                email: bodyData.email.toLowerCase(),
                phoneNumber: bodyData.phoneNumber,
                password: bodyData.password,
                role: role,
                otp: generate({
                    length: 4,
                    charset: 'numeric'
                }),
            }

            var condition = {};
            condition.email = userData.email

            let existingUser = await getOne(condition);
            if(existingUser){
                return reject({ message: "User already exists with same email !" });
            }

            if (userData.password.length <= 5) {
                return reject({ message: "Password should be greater than 6 characters" });
            } else if (userData.password) {
                //Using bcrypt to hash the password
                var hashedPassword = await bcryptjs.hash(userData.password, saltRounds);
                userData.password = hashedPassword;

                //Inserting data into DB
                let result = await create(userData);
                if (result) {
                    let emailOptions = sendOTPEmail(userData.email, userData.fullName, userData.otp);
                    //Sending otp in user email
                    sendMail(emailOptions);
                   
                    resolve(prepareUserRes(result));
                } else {
                    return reject({ message: "Error while creating a new User !" })
                }
            }

        } catch (error) {
            reject(error);
        }
    })
}

/**
 * Login
 * req (Request Object)
 * userData (Request Body)
 * return JWT Token with user details
 */
export async function authenticate(userData) {
    return new Promise( async (resolve, reject) => {
        try {
            if (!userData.email || !userData.password) {
                return reject({ message: "Invalid Data !!" });
            }
            var condition = {};
            condition.email = userData.email

            let user = await UserModel.findOne(condition);
            if (!user) {
                return reject({ message: "User not found!", status:404 });

            } else if (user.auditFields.isDeleted) {
                return reject({ message: "User has been deleted!" });

            } else if (user.isBlocked) {
                return reject({ message: "User has been blocked!", status:403 });

            } else if (!(user.auditFields.isActive && user.isVerified)) {
                return reject({ message: "User not active!", data: { isVerified: user.isVerified, auditFields: user.auditFields }});
            } else {
                let updateFields = {};
                //Comparing password with hashed password
                let passwordMatch = await bcryptjs.compare(userData.password, user.password);
                
                if (passwordMatch) {
                    //Generating JWT token
                    let token = jwt.sign({ _id: user._id }, process.env.API_SECRET, {
                        expiresIn: 7889238 //3 months 203800 //1 week
                    });

                    updateFields['auditFields.updatedAt'] = new Date();

                    await UserModel.findOneAndUpdate({_id: user._id}, {$set: updateFields});
                    resolve({ "token": "Bearer " + token, ...prepareUserRes(user) })

                } else {
                    return reject({ message: "Incorrect Password!" });
                }
            }
        } catch (error) {
            return reject({ message: "Internal server error while logging in." });
        }
    })
}

/**
 * Activate User
 * req (Request Object)
 * activateData (Request Body)
 * return activate user
 */
export async function verifyUser(activateData) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!activateData.email) {
                return reject({ message: "Invalid Email !!" });
            }
            var condition = {};
            condition.email = activateData.email;

            const otp = activateData.otp

            let existingUser = await UserModel.findOne(condition);
            if (!existingUser) {
                return reject({ message: "User doesn't exist!" });
            } else {
                let updateFields = {};

                let isVerified = existingUser.isVerified || false

                if(otp == existingUser.otp){
                    isVerified = true
                }
                
                updateFields['auditFields.isActive'] = (existingUser.auditFields.isActive);
                updateFields.isVerified = isVerified;
                
                let user = await updateByCondition({'_id': existingUser._id} , updateFields);
                if (user && user.modifiedCount !== 0) {
                    resolve(prepareUserRes(existingUser))
                } else {
                    return reject({ message: "Unable to activate user" });
                }

            }

        } catch (error) {
            reject(error)
        }
    })
}

/**
 * Resend OTP
 * req (Request Object)
 * activeData (Request query)
 * Sending otp in user email
 */
export async function resendOtp(activeData) {
    return new Promise(async (resolve, reject) => {
        try {
            var condition = {};
            condition.email = (activeData.email||'').toLowerCase()
           
            
            let user = await UserModel.findOne(condition);
            if (!user) {
                return reject({ message: "User not exists" });
            } else {
                
                user.otp = generate({
                    length: 4,
                    charset: 'numeric'
                })

                await UserModel.findByIdAndUpdate(user._id, user);
                let emailOptions;
                if(activeData.forgot){
                    //Forgot password context
                    emailOptions = sendForgotOTPEmail(user.email, user.fullName, user.otp);
                } else {
                    //Resend otp context
                    emailOptions = sendResendOTPEmail(user.email, user.fullName, user.otp);
                }
                sendMail(emailOptions);
                resolve({email: user.email})
            }

        } catch (error) {
            reject(error)
        }
    })
}
