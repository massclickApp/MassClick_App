    import express from 'express'

    import { addCategoryAction, viewCategoryAction, viewAllCategoryAction, updateCategoryAction, deleteCategoryAction } from "../controller/category/categoryController.js"
    import { oauthAuthentication } from '../helper/oauthHelper.js';


    const router = express.Router();

    router.post('/api/category/create', oauthAuthentication, addCategoryAction);
    router.get('/api/category/view/:id', oauthAuthentication, viewCategoryAction);
    router.get('/api/category/viewall', oauthAuthentication, viewAllCategoryAction);
    router.put('/api/category/update/:id', oauthAuthentication, updateCategoryAction);
    router.delete('/api/category/delete/:id', oauthAuthentication, deleteCategoryAction);

    export default router; 