"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import RecipeCard from "@/components/recipe-card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getRecipes } from "@/lib/api"

export default function HomePage() {
  const router = useRouter()
  const [recipes, setRecipes] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [categories] = useState(["Breakfast", "Lunch", "Dinner", "Dessert", "Vegetarian", "Vegan", "Gluten-Free"])

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true)
        const data = await getRecipes()
        setRecipes(data)
      } catch (error) {
        console.error("Failed to fetch recipes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecipes()
  }, [])

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-amber-100 to-orange-100 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Discover & Share Amazing Recipes
                </h1>
                <p className="text-gray-600 md:text-xl">
                  Join our community of food lovers to discover, share, and create delicious recipes from around the
                  world.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={() => router.push("/recipes/create")} className="bg-orange-600 hover:bg-orange-700">
                    Share a Recipe
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/explore")}>
                    Explore Recipes
                  </Button>
                </div>
              </div>
              <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Delicious food"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <h2 className="text-2xl font-bold text-center">Find Your Next Favorite Recipe</h2>
              <div className="w-full max-w-md relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search recipes..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <Button key={category} variant="outline" size="sm" className="rounded-full">
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Recipes */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Featured Recipes</h2>
              <Link href="/recipes" className="text-orange-600 hover:text-orange-700 flex items-center">
                View all <ChevronRight size={16} />
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md h-[350px] animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.slice(0, 6).map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No recipes found. Be the first to share a recipe!</p>
                <Button
                  onClick={() => router.push("/recipes/create")}
                  className="mt-4 bg-orange-600 hover:bg-orange-700"
                >
                  Share a Recipe
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Join Community Section */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Cooking Community</h2>
            <p className="max-w-2xl mx-auto mb-8">
              Connect with food enthusiasts, share your culinary creations, and discover recipes from around the world.
            </p>
            <Button
              onClick={() => router.push("/auth/register")}
              variant="secondary"
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100"
            >
              Sign Up Now
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

