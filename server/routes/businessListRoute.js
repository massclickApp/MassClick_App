import express from 'express'

import { addBusinessListAction, getTrendingSearchesAction, viewBusinessListAction, getSuggestionsController, mainSearchController, viewAllBusinessListAction, updateBusinessListAction, deleteBusinessListAction, activeBusinessListAction, viewAllClientBusinessListAction, viewBusinessByCategory, findBusinessByMobileAction, dashboardSummaryAction, dashboardChartsAction } from "../controller/businessList/businessListController.js"
import { oauthAuthentication } from '../helper/oauthHelper.js';
import { logSearchAction, viewLogSearchAction, viewSearchAction } from "../controller/businessList/logSearchController.js"

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
router.post('/api/businesslist/trending-searches/view', oauthAuthentication, viewSearchAction);
router.get('/api/businesslist/search', oauthAuthentication, mainSearchController);
router.get('/api/businesslist/suggestions', oauthAuthentication, getSuggestionsController);
router.get('/api/businesslist/category', oauthAuthentication, viewBusinessByCategory);
router.get("/api/businesslist/findByMobile/:mobile", findBusinessByMobileAction);
router.get('/api/businesslist/dashboard-summary', oauthAuthentication, dashboardSummaryAction);
router.get('/api/businesslist/dashboard-charts', oauthAuthentication, dashboardChartsAction);


export default router; 