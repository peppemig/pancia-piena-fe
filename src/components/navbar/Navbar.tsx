import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
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
                <NavigationMenuItem>
                  <Avatar>
                    <AvatarImage
                      src={user.photoURL === null ? "" : user.photoURL}
                    />
                    <AvatarFallback>
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button onClick={onLogout} variant="destructive">
                    Esci
                  </Button>
                </NavigationMenuItem>
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
