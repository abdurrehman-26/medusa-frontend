import { ShoppingCart, Search, User, Package2, LogOut } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/modules/Shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Navbar() {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 flex h-12 sm:h-16 items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary">
          MyStore
        </Link>

        {/* Right Icons */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Search */}
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search size={20} />
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Cart */}
          <Button asChild className="rounded-full" size="icon" variant="ghost">
            <Link href="/cart" className="relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                3
              </span>
            </Link>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="p-2 rounded-full">
                <User size={20} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-50">
              <DropdownMenuItem asChild>
                <Link href="/account" className="w-full">
                  <User />
                  My Account
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/orders" className="w-full">
                  <Package2 />
                  My Orders
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem variant="destructive" asChild>
                <Link href="/logout" className="w-full">
                  <LogOut />
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </header>
  );
}
