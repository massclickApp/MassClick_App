import express from "express";
import {
  addSeoAction,
  getSeoAction,
  viewAllSeoAction,
  updateSeoAction,
  deleteSeoAction,
  getSeoMetaAction,
  categorySuggestionAction
} from "../controller/seo/seoController.js";
import { addSeoPageContentAction, viewAllSeoPageContentAction,getSeoPageContentMetaAction,getSeoPageContentAction,deleteSeoPageContentAction,updateSeoPageContentAction } from "../controller/seo/seoPageContentController.js";
import { oauthAuthentication } from "../helper/oauthHelper.js";

const router = express.Router();

router.post("/api/seo/create", oauthAuthentication, addSeoAction);
router.get("/api/seo/get", getSeoAction); 
router.get("/api/seo/meta", getSeoMetaAction);
router.get("/api/seo/viewall", oauthAuthentication, viewAllSeoAction);
router.put("/api/seo/update/:id", oauthAuthentication, updateSeoAction);
router.delete("/api/seo/delete/:id", oauthAuthentication, deleteSeoAction);
router.get("/api/seo/category-suggestions", oauthAuthentication, categorySuggestionAction);

router.post("/api/seopagecontent/create", oauthAuthentication, addSeoPageContentAction);
router.get("/api/seopagecontent/get", getSeoPageContentAction); 
router.get("/api/seopagecontent/meta", getSeoPageContentMetaAction);
router.get("/api/seopagecontent/viewall", oauthAuthentication, viewAllSeoPageContentAction);
router.put("/api/seopagecontent/update/:id", oauthAuthentication, updateSeoPageContentAction);
router.delete("/api/seopagecontent/delete/:id", oauthAuthentication, deleteSeoPageContentAction);

export default router;
