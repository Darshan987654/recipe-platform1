import express from "express"
import {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  addComment,
  toggleLike,
  getUserRecipes,
} from "../controllers/recipeController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").get(getRecipes).post(protect, createRecipe)

router.route("/:id").get(getRecipe).put(protect, updateRecipe).delete(protect, deleteRecipe)

router.route("/:id/comments").post(protect, addComment)

router.route("/:id/like").post(protect, toggleLike)

router.route("/user/:userId").get(getUserRecipes)

export default router

