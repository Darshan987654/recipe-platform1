import Recipe from "../models/Recipe.js"
import { asyncHandler } from "../middleware/asyncHandler.js"

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public
export const getRecipes = asyncHandler(async (req, res) => {
  const { category, search, sort, limit = 10, page = 1 } = req.query

  // Build query
  const query = {}

  // Filter by category
  if (category) {
    query.categories = { $in: [category] }
  }

  // Search by title or description
  if (search) {
    query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
  }

  // Pagination
  const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

  // Sort options
  let sortOption = {}
  if (sort === "newest") {
    sortOption = { createdAt: -1 }
  } else if (sort === "oldest") {
    sortOption = { createdAt: 1 }
  } else if (sort === "popular") {
    sortOption = { likeCount: -1 }
  } else {
    sortOption = { createdAt: -1 } // Default sort
  }

  const recipes = await Recipe.find(query)
    .populate("author", "name profileImage")
    .sort(sortOption)
    .skip(skip)
    .limit(Number.parseInt(limit))

  const total = await Recipe.countDocuments(query)

  res.status(200).json({
    success: true,
    count: recipes.length,
    total,
    pages: Math.ceil(total / Number.parseInt(limit)),
    page: Number.parseInt(page),
    data: recipes,
  })
})

// @desc    Get single recipe
// @route   GET /api/recipes/:id
// @access  Public
export const getRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id)
    .populate("author", "name profileImage")
    .populate("comments.user", "name profileImage")

  if (!recipe) {
    res.status(404)
    throw new Error("Recipe not found")
  }

  res.status(200).json({
    success: true,
    data: recipe,
  })
})

// @desc    Create new recipe
// @route   POST /api/recipes
// @access  Private
export const createRecipe = asyncHandler(async (req, res) => {
  req.body.author = req.user.id

  const recipe = await Recipe.create(req.body)

  res.status(201).json({
    success: true,
    data: recipe,
  })
})

// @desc    Update recipe
// @route   PUT /api/recipes/:id
// @access  Private
export const updateRecipe = asyncHandler(async (req, res) => {
  let recipe = await Recipe.findById(req.params.id)

  if (!recipe) {
    res.status(404)
    throw new Error("Recipe not found")
  }

  // Make sure user is recipe owner
  if (recipe.author.toString() !== req.user.id) {
    res.status(401)
    throw new Error("Not authorized to update this recipe")
  }

  recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: recipe,
  })
})

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private
export const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id)

  if (!recipe) {
    res.status(404)
    throw new Error("Recipe not found")
  }

  // Make sure user is recipe owner
  if (recipe.author.toString() !== req.user.id) {
    res.status(401)
    throw new Error("Not authorized to delete this recipe")
  }

  await recipe.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})

// @desc    Add comment to recipe
// @route   POST /api/recipes/:id/comments
// @access  Private
export const addComment = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id)

  if (!recipe) {
    res.status(404)
    throw new Error("Recipe not found")
  }

  const comment = {
    user: req.user.id,
    content: req.body.content,
  }

  recipe.comments.push(comment)

  await recipe.save()

  res.status(201).json({
    success: true,
    data: recipe,
  })
})

// @desc    Toggle like on recipe
// @route   POST /api/recipes/:id/like
// @access  Private
export const toggleLike = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id)

  if (!recipe) {
    res.status(404)
    throw new Error("Recipe not found")
  }

  // Check if already liked
  const alreadyLiked = recipe.likes.includes(req.user.id)

  if (alreadyLiked) {
    // Remove like
    recipe.likes = recipe.likes.filter((like) => like.toString() !== req.user.id)
  } else {
    // Add like
    recipe.likes.push(req.user.id)
  }

  await recipe.save()

  res.status(200).json({
    success: true,
    liked: !alreadyLiked,
    data: recipe,
  })
})

// @desc    Get user recipes
// @route   GET /api/recipes/user/:userId
// @access  Public
export const getUserRecipes = asyncHandler(async (req, res) => {
  const { limit = 10, page = 1 } = req.query

  const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

  const recipes = await Recipe.find({ author: req.params.userId })
    .populate("author", "name profileImage")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number.parseInt(limit))

  const total = await Recipe.countDocuments({ author: req.params.userId })

  res.status(200).json({
    success: true,
    count: recipes.length,
    total,
    pages: Math.ceil(total / Number.parseInt(limit)),
    page: Number.parseInt(page),
    data: recipes,
  })
})

