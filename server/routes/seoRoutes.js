import express from "express";
import {
  addSeoAction,
  getSeoAction,
  viewAllSeoAction,
  updateSeoAction,
  deleteSeoAction,
  getSeoMetaAction
} from "../controller/seo/seoController.js";
import { oauthAuthentication } from "../helper/oauthHelper.js";

const router = express.Router();

router.post("/api/seo/create", oauthAuthentication, addSeoAction);
router.get("/api/seo/get", getSeoAction); 
router.get("/api/seo/meta", getSeoMetaAction);
router.get("/api/seo/viewall", oauthAuthentication, viewAllSeoAction);
router.put("/api/seo/update/:id", oauthAuthentication, updateSeoAction);
router.delete("/api/seo/delete/:id", oauthAuthentication, deleteSeoAction);

export default router;
