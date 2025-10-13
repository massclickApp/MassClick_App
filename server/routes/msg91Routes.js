import express from 'express';
import { requestOtp, verifyOtpAndLogin } from '../controller/msg91/msg91Controller.js';

const router = express.Router();

router.post('/api/otp/send',  requestOtp);

router.post('/api/otp/verify',  verifyOtpAndLogin);

export default router;
