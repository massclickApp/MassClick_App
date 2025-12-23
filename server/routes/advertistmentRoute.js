import express from 'express'

import { addAdvertisementAction,viewAdvertisementAction,viewAllAdvertisementAction,updateAdvertisementAction,deleteAdvertisementAction, viewAdvertisementByCategory } from "../controller/advertistment/advertismentController.js"
import { oauthAuthentication } from '../helper/oauthHelper.js';


const router = express.Router();

router.post('/api/advertisment/create', oauthAuthentication, addAdvertisementAction);
router.get('/api/advertisment/view/:id', oauthAuthentication, viewAdvertisementAction);
router.get('/api/advertisment/viewall', oauthAuthentication, viewAllAdvertisementAction);
router.put('/api/advertisment/update/:id', oauthAuthentication, updateAdvertisementAction);
router.delete('/api/advertisment/delete/:id', oauthAuthentication, deleteAdvertisementAction);
router.get('/api/advertisment/category', oauthAuthentication, viewAdvertisementByCategory);

export default router; 