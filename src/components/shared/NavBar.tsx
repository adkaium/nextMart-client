"use client";
// import Logo from "@/app/assets/svgs/Logo";
import Logo from "@/app/assets/svgs/Logo";
import {Button} from "../ui/button";
import {
  Heart,
  ShoppingBag,
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Link from "next/link";
import { logOutUser } from "@/services/AuthService";
import { useUser } from "@/context/UserContext";


export default function Navbar() {
  const {setUser,user} = useUser();

  const handleLogout =() => {
    logOutUser();
    setUser(null);
  }
  return (
    <header className="border-b w-full">
      <div className="container flex justify-between items-center mx-auto h-16 px-3">
        <h1 className="text-2xl font-black flex items-center">
          <Logo />
          Next Mart
        </h1>
        <div className="max-w-md  flex-grow">
          <input
            type="text"
            placeholder="Search for products"
            className="w-full max-w-6xl border border-gray-300 rounded-full py-2 px-5"
          />
        </div>
        <nav className="flex gap-2">
          <Button variant="outline" className="rounded-full p-0 size-10">
            <Heart />
          </Button>
          <Button variant="outline" className="rounded-full p-0 size-10">
            <ShoppingBag />
          </Button>
          {user ? (
            <>
            <Button variant="default" className="rounded-full ">
              <Link href="/create-store">Create Store</Link>
            </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="shadcn"
                    />
                    <AvatarFallback>User</AvatarFallback>
                  </Avatar>
                </Button>
              }
            />
            <DropdownMenuContent>
              <DropdownMenuItem>
                <UserIcon />
                profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon />
                My Store
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                <LogOutIcon />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
            </>):(
            <Button variant="default" className="rounded-full ">
              <Link href="/login">Login</Link>
            </Button>)}
        </nav>
      </div>
    </header>
  );
}
