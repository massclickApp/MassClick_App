import express from 'express'

import {addUsersClientAction, viewUsersClientAction, viewAllUsersClientAction,updateUsersClientAction,deleteUsersClientAction} from "../controller/userClient/userClientController.js"
import { oauthAuthentication } from '../helper/oauthHelper.js';


const router = express.Router();

router.post('/api/userclient/create',oauthAuthentication,  addUsersClientAction);
router.get('/api/userclient/view/:id', oauthAuthentication, viewUsersClientAction);
router.get('/api/userclient/viewall', oauthAuthentication, viewAllUsersClientAction);
router.put('/api/userclient/update/:id', oauthAuthentication, updateUsersClientAction);
router.delete('/api/userclient/delete/:id', oauthAuthentication, deleteUsersClientAction);

export default router; 