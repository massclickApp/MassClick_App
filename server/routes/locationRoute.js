import express from 'express'

import {addLocationAction, viewLocationAction, viewAllLocationAction,updateLocationAction,deleteLocationAction} from "../controller/location/locationController.js"
import { oauthAuthentication } from '../helper/oauthHelper.js';


const router = express.Router();

router.post('/api/location/create',oauthAuthentication,  addLocationAction);
router.get('/api/location/view/:id', oauthAuthentication, viewLocationAction);
router.get('/api/location/viewall', oauthAuthentication, viewAllLocationAction);
router.put('/api/location/update/:id', oauthAuthentication, updateLocationAction);
router.delete('/api/location/delete/:id', oauthAuthentication, deleteLocationAction);

export default router; 