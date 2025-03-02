"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, ChefHat, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { checkAuth, logout } from "@/lib/api"

export default function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true)
        const userData = await checkAuth()
        setUser(userData)
      } catch (error) {
        console.error("Not authenticated", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-orange-600" />
              <span className="text-xl font-bold">RecipeShare</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Home
            </Link>
            <Link href="/recipes" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Recipes
            </Link>
            <Link href="/explore" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Explore
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-orange-600 transition-colors">
              About
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isLoading ? (
              <div className="h-9 w-20 bg-gray-200 animate-pulse rounded-md"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/recipes/my-recipes">My Recipes</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/recipes/create">Create Recipe</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={() => router.push("/auth/login")}>
                  Log in
                </Button>
                <Button onClick={() => router.push("/auth/register")} className="bg-orange-600 hover:bg-orange-700">
                  Sign up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-sm font-medium hover:text-orange-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/recipes"
                className="text-sm font-medium hover:text-orange-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Recipes
              </Link>
              <Link
                href="/explore"
                className="text-sm font-medium hover:text-orange-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Explore
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium hover:text-orange-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </nav>

            <div className="pt-4 border-t">
              {isLoading ? (
                <div className="h-9 w-full bg-gray-200 animate-pulse rounded-md"></div>
              ) : user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => {
                        router.push("/profile")
                        setIsMenuOpen(false)
                      }}
                    >
                      Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => {
                        router.push("/recipes/my-recipes")
                        setIsMenuOpen(false)
                      }}
                    >
                      My Recipes
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => {
                        router.push("/recipes/create")
                        setIsMenuOpen(false)
                      }}
                    >
                      Create Recipe
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => {
                        router.push("/settings")
                        setIsMenuOpen(false)
                      }}
                    >
                      Settings
                    </Button>
                    <Button
                      variant="destructive"
                      className="justify-start"
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      router.push("/auth/login")
                      setIsMenuOpen(false)
                    }}
                  >
                    Log in
                  </Button>
                  <Button
                    onClick={() => {
                      router.push("/auth/register")
                      setIsMenuOpen(false)
                    }}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

