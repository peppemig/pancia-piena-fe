import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Package,
  ChefHat,
  PlusCircleIcon,
  LogOut,
  AreaChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Moon, Sun } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeProvider";
import { logOut } from "../../config/firebaseConfig";
import { User } from "firebase/auth";

type NavbarProps = {
  user: User | null | undefined;
};

const Navbar = ({ user }: NavbarProps) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const onLogout = () => {
    logOut();
    navigate("/");
  };

  return (
    <div className="w-full border h-16 flex items-center justify-center">
      <div className="container-custom flex justify-between items-center">
        <Link to="/" className="font-bold text-lg">
          Pancia Piena
        </Link>
        <NavigationMenu>
          <NavigationMenuList className="flex gap-1">
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar style={{ cursor: "pointer" }}>
                      <AvatarImage
                        src={user.photoURL === null ? "" : user.photoURL}
                      />
                      <AvatarFallback className="font-semibold">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Il mio account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => navigate("/orders/list")}
                      >
                        <ChefHat className="mr-2 h-4 w-4" />
                        <span>Ordini</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/orders/create")}
                      >
                        <PlusCircleIcon className="mr-2 h-4 w-4" />
                        <span>Crea un ordine</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/products/list")}
                      >
                        <Package className="mr-2 h-4 w-4" />
                        <span>Prodotti</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                        <AreaChart className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Esci</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <NavigationMenuItem>
                  <Link
                    to="/login"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Accedi
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    to="/register"
                    className={buttonVariants({ variant: "default" })}
                  >
                    Registrati
                  </Link>
                </NavigationMenuItem>
              </>
            )}
            <Button
              variant="ghost"
              onClick={() => {
                theme === "dark" ? setTheme("light") : setTheme("dark");
              }}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default Navbar;
