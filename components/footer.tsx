import Link from "next/link"
import { ChefHat, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-orange-500" />
              <span className="text-xl font-bold text-white">RecipeShare</span>
            </div>
            <p className="text-sm">Discover, share, and create delicious recipes from around the world.</p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-orange-500 transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="hover:text-orange-500 transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="hover:text-orange-500 transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="hover:text-orange-500 transition-colors">
                <Youtube size={20} />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-orange-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/recipes" className="hover:text-orange-500 transition-colors">
                  Recipes
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-orange-500 transition-colors">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-orange-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/breakfast" className="hover:text-orange-500 transition-colors">
                  Breakfast
                </Link>
              </li>
              <li>
                <Link href="/category/lunch" className="hover:text-orange-500 transition-colors">
                  Lunch
                </Link>
              </li>
              <li>
                <Link href="/category/dinner" className="hover:text-orange-500 transition-colors">
                  Dinner
                </Link>
              </li>
              <li>
                <Link href="/category/dessert" className="hover:text-orange-500 transition-colors">
                  Dessert
                </Link>
              </li>
              <li>
                <Link href="/category/vegetarian" className="hover:text-orange-500 transition-colors">
                  Vegetarian
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Subscribe</h3>
            <p className="text-sm mb-4">
              Subscribe to our newsletter for new recipes, cooking tips, and exclusive offers.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-3 py-2 text-gray-900 bg-white rounded-md"
                required
              />
              <button
                type="submit"
                className="w-full px-3 py-2 text-white bg-orange-600 rounded-md hover:bg-orange-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} RecipeShare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

