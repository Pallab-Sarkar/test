import { Router } from 'express';
const router = Router();
import { register, authenticate, verifyUser, resendOtp} from "../service/AuthService.js";
import customerLogger  from '../utils/logger.js'

// (REGISTER) Creating user
router.post('/register', (req,res) => {

    register(req.body).then((result) =>{
        res.status(201).json({success: true,message: "Registered Successfully", data: result})
    }).catch(err =>{
        customerLogger.error(err)
        res.status(err.status||400).json(err)
    })
})

//(LOGIN) Getting JWT TOKEN with user details
router.post('/login',(req,res) => {

    authenticate(req.body).then((result) => {
        res.status(200).json({ success: true, message: "Logged in Successfully", data: result });
    }).catch(err =>{
        customerLogger.error(err)
        res.status(err.status||400).json(err)
    })
})

//(VERIFY) verfiy the user
router.post('/verify-otp',(req,res) => {

    verifyUser(req.body).then((result) => {
        res.status(200).json({ success: true, message: "User activated Successfully", data: result });
    }).catch(err =>{
        customerLogger.error(err)
        res.status(err.status||400).json(err)
    })
})

//( RESEND OTP) Resending otp in user email
router.post('/resend-otp',(req,res) => {

    resendOtp(req.body).then((result) => {
        res.status(200).json({ success: true, message: "OTP re-sent Successfully", data: result });
    }).catch(err =>{
        customerLogger.error(err)
        res.status(err.status||400).json(err)
    })
})

// Sending otp in email (with different context)
router.post('/forgot-password',(req,res) => {

    resendOtp({...req.body,forgot:true}).then((result) => {
        res.status(200).json({ success: true, message: "OTP Sent Successfully", data: result });
    }).catch(err =>{
        customerLogger.error(err)
        res.status(err.status||400).json(err)
    })
})

export default router