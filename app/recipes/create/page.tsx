"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Minus, Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { createRecipe, uploadImage } from "@/lib/api"

export default function CreateRecipePage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [cookTime, setCookTime] = useState("")
  const [servings, setServings] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "", unit: "" }])
  const [steps, setSteps] = useState([{ description: "" }])
  const [categories, setCategories] = useState([])
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const categoryOptions = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Dessert",
    "Appetizer",
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Low-Carb",
  ]

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }])
  }

  const handleRemoveIngredient = (index) => {
    const newIngredients = [...ingredients]
    newIngredients.splice(index, 1)
    setIngredients(newIngredients)
  }

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients]
    newIngredients[index][field] = value
    setIngredients(newIngredients)
  }

  const handleAddStep = () => {
    setSteps([...steps, { description: "" }])
  }

  const handleRemoveStep = (index) => {
    const newSteps = [...steps]
    newSteps.splice(index, 1)
    setSteps(newSteps)
  }

  const handleStepChange = (index, value) => {
    const newSteps = [...steps]
    newSteps[index].description = value
    setSteps(newSteps)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCategoryChange = (value) => {
    if (categories.includes(value)) {
      setCategories(categories.filter((cat) => cat !== value))
    } else {
      setCategories([...categories, value])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!title || !description || !cookTime || !servings || !difficulty) {
      setError("Please fill in all required fields")
      return
    }

    if (ingredients.some((ing) => !ing.name || !ing.quantity)) {
      setError("Please fill in all ingredient details")
      return
    }

    if (steps.some((step) => !step.description)) {
      setError("Please fill in all cooking steps")
      return
    }

    try {
      setIsLoading(true)

      let imageUrl = null
      if (image) {
        const uploadResult = await uploadImage(image)
        imageUrl = uploadResult.url
      }

      const recipeData = {
        title,
        description,
        cookTime: Number.parseInt(cookTime),
        servings: Number.parseInt(servings),
        difficulty,
        ingredients,
        steps: steps.map((step) => step.description),
        categories,
        image: imageUrl,
      }

      await createRecipe(recipeData)
      router.push("/recipes/my-recipes")
    } catch (err) {
      setError(err.message || "Failed to create recipe. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Create a New Recipe</CardTitle>
            <CardDescription>Share your culinary creations with the community</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Recipe Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Homemade Chocolate Chip Cookies"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Recipe Image</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <Label
                          htmlFor="image"
                          className="flex items-center justify-center gap-2 h-10 px-4 border rounded-md cursor-pointer hover:bg-gray-50"
                        >
                          <Upload className="h-4 w-4" />
                          {image ? "Change Image" : "Upload Image"}
                        </Label>
                      </div>
                      {imagePreview && (
                        <div className="h-16 w-16 rounded-md overflow-hidden">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Recipe preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe your recipe..."
                    rows={3}
                    required
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="cookTime">Cook Time (minutes) *</Label>
                    <Input
                      id="cookTime"
                      type="number"
                      min="1"
                      value={cookTime}
                      onChange={(e) => setCookTime(e.target.value)}
                      placeholder="e.g., 30"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="servings">Servings *</Label>
                    <Input
                      id="servings"
                      type="number"
                      min="1"
                      value={servings}
                      onChange={(e) => setServings(e.target.value)}
                      placeholder="e.g., 4"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty *</Label>
                    <Select value={difficulty} onValueChange={setDifficulty} required>
                      <SelectTrigger id="difficulty">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Categories</Label>
                  <div className="flex flex-wrap gap-2">
                    {categoryOptions.map((category) => (
                      <Button
                        key={category}
                        type="button"
                        variant={categories.includes(category) ? "default" : "outline"}
                        size="sm"
                        className={categories.includes(category) ? "bg-orange-600 hover:bg-orange-700" : ""}
                        onClick={() => handleCategoryChange(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Ingredients</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddIngredient}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add Ingredient
                  </Button>
                </div>
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="grid gap-4 md:grid-cols-4 items-end">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`ingredient-name-${index}`}>Ingredient</Label>
                      <Input
                        id={`ingredient-name-${index}`}
                        value={ingredient.name}
                        onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                        placeholder="e.g., Flour"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`ingredient-quantity-${index}`}>Quantity</Label>
                      <Input
                        id={`ingredient-quantity-${index}`}
                        value={ingredient.quantity}
                        onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                        placeholder="e.g., 2"
                        required
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="space-y-2 flex-1">
                        <Label htmlFor={`ingredient-unit-${index}`}>Unit</Label>
                        <Input
                          id={`ingredient-unit-${index}`}
                          value={ingredient.unit}
                          onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                          placeholder="e.g., cups"
                        />
                      </div>
                      {ingredients.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveIngredient(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Minus className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Cooking Steps</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddStep}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add Step
                  </Button>
                </div>
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-orange-100 text-orange-600 font-medium text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`step-${index}`}>Step {index + 1}</Label>
                      <Textarea
                        id={`step-${index}`}
                        value={step.description}
                        onChange={(e) => handleStepChange(index, e.target.value)}
                        placeholder={`Describe step ${index + 1}...`}
                        rows={2}
                        required
                      />
                    </div>
                    {steps.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveStep(index)}
                        className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 mt-8"
                      >
                        <Minus className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Recipe"
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

