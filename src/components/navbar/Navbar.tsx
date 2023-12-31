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
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../providers/ThemeProvider";
import { logOut } from "../../config/firebaseConfig";
import { useAuthState } from "@/providers/AuthProvider";

const Navbar = () => {
  const auth = useAuthState();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const onLogout = () => {
    logOut();
    navigate("/");
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b h-16 flex items-center justify-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom flex justify-between items-center">
        <Link to="/" className="font-bold text-lg">
          Pancia Piena
        </Link>
        <NavigationMenu>
          <NavigationMenuList className="flex gap-1">
            <Button
              variant="ghost"
              onClick={() => {
                theme === "dark" ? setTheme("light") : setTheme("dark");
              }}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
            {auth.state === "loaded" && auth.isAuthentication ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar style={{ cursor: "pointer" }}>
                      <AvatarImage
                        src={
                          auth.user.photoURL === null ? "" : auth.user.photoURL
                        }
                      />
                      <AvatarFallback className="font-semibold">
                        {auth.user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Il mio account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => navigate("/orders")}>
                        <ChefHat className="mr-2 h-4 w-4" />
                        <span>Ordini</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/orders/create")}
                      >
                        <PlusCircleIcon className="mr-2 h-4 w-4" />
                        <span>Crea un ordine</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/products")}>
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
                    className={buttonVariants({ variant: "secondary" })}
                  >
                    Accedi
                  </Link>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

export default Navbar;
