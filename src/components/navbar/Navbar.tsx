import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "../ThemeProvider";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  console.log(theme);
  return (
    <div className="w-full border h-16 flex items-center justify-center">
      <div className="container-custom flex justify-between items-center">
        <Link to="/" className="font-bold text-lg">
          Pancia Piena
        </Link>
        <NavigationMenu>
          <NavigationMenuList className="flex gap-1">
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
