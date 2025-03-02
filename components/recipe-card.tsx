import Link from "next/link"
import { Clock, User, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function RecipeCard({ recipe }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={recipe.image || "/placeholder.svg?height=225&width=400"}
          alt={recipe.title}
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 rounded-full hover:bg-white">
            <Heart className="h-4 w-4 text-red-500" />
            <span className="sr-only">Like</span>
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {recipe.categories &&
              recipe.categories.slice(0, 2).map((category) => (
                <Badge key={category} variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                  {category}
                </Badge>
              ))}
          </div>
          <Link href={`/recipes/${recipe._id}`}>
            <h3 className="font-bold text-lg line-clamp-1 hover:text-orange-600 transition-colors">{recipe.title}</h3>
          </Link>
          <p className="text-muted-foreground text-sm line-clamp-2">{recipe.description}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
        <div className="flex items-center">
          <Clock className="mr-1 h-4 w-4" />
          <span>{recipe.cookTime} mins</span>
        </div>
        <div className="flex items-center">
          <User className="mr-1 h-4 w-4" />
          <span>{recipe.author?.name || "Unknown"}</span>
        </div>
      </CardFooter>
    </Card>
  )
}

