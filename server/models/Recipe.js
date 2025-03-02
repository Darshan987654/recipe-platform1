import mongoose from "mongoose"

const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
)

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a recipe title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a recipe description'],
    trim: true
  },
  ingredients: [ingredientSchema],
  steps: [{
    type: String,
    required: true,
    trim: true
  }],
  cookTime: {
    type: Number,
    required: [true, 'Please provide cooking time'],
    min: 1
  },
  servings: {
    type: Number,
    required: [true, 'Please provide number of servings'],
    min: 1
  },
  difficulty: {
    type: String,\
    require  'Please provide number of servings'],
    min: 1
  },
  difficulty: {
    type: String,
    required: [true, 'Please provide difficulty level'],
    enum: ['Easy', 'Medium', 'Hard']
  },
  image: {
    type: String,
    default: ''
  },
  categories: [{
    type: String,
    trim: true
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for like count
recipeSchema.virtual("likeCount").get(function () {
  return this.likes.length
})

// Virtual for comment count
recipeSchema.virtual("commentCount").get(function () {
  return this.comments.length
})

const Recipe = mongoose.model("Recipe", recipeSchema)

export default Recipe

