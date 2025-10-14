import express from 'express';
import { requestOtp, verifyOtpAndLogin, updateOtpUser, viewOtpUser, viewAllOtpUsers, deleteOtpUser  } from '../controller/msg91/msg91Controller.js';

const router = express.Router();

router.post('/api/otp/send',  requestOtp);

router.post('/api/otp/verify',  verifyOtpAndLogin);


router.put('/api/otp_user_update/:mobile', updateOtpUser);
router.get('/api/otp_user/:mobile', viewOtpUser);
router.get('/api/otp_users', viewAllOtpUsers);
router.delete('/api/otp_user/:mobile', deleteOtpUser);

export default router;
