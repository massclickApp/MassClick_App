import express from 'express'

import { addBusinessListAction, getTrendingSearchesAction, viewBusinessListAction, viewAllBusinessListAction, updateBusinessListAction, deleteBusinessListAction, activeBusinessListAction, viewAllClientBusinessListAction } from "../controller/businessList/businessListController.js"
import { oauthAuthentication } from '../helper/oauthHelper.js';
import {logSearchAction, viewLogSearchAction} from "../controller/businessList/logSearchController.js"

const router = express.Router();

router.post('/api/businesslist/create', oauthAuthentication, addBusinessListAction);
router.get('/api/businesslist/view/:id', oauthAuthentication, viewBusinessListAction);
router.get('/api/businesslist/viewall', oauthAuthentication, viewAllBusinessListAction);
router.get('/api/businesslist/clientview', oauthAuthentication, viewAllClientBusinessListAction);
router.put('/api/businesslist/update/:id', oauthAuthentication, updateBusinessListAction);
router.delete('/api/businesslist/delete/:id', oauthAuthentication, deleteBusinessListAction);
router.put('/api/businesslist/activate/:id', oauthAuthentication, activeBusinessListAction);
router.post('/api/businesslist/log-search', oauthAuthentication, logSearchAction);
router.get('/api/businesslist/trending-searches', oauthAuthentication, getTrendingSearchesAction);
router.get('/api/businesslist/trending-searches/viewall', oauthAuthentication, viewLogSearchAction);


export default router; 