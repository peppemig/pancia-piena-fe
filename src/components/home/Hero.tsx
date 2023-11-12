import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Lottie from "lottie-react";
import heroAnimation from "../../assets/hero-animation.json";
import { useAuthState } from "@/providers/AuthProvider";
import LoadingState from "../LoadingState";

const Hero = () => {
  const auth = useAuthState();

  if (auth.state === "loading") {
    return <LoadingState />;
  }

  return (
    <section className="container-custom flex flex-col gap-4 pb-12 pt-4 text-center lg:items-center lg:gap-8 lg:py-20">
      <div className="flex flex-1 flex-col items-center gap-4 text-center lg:gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold lg:text-6xl">Pancia Piena</h1>
          <h2 className="text-lg font-light text-muted-foreground lg:text-3xl">
            Rivoluziona la gestione degli ordini nel tuo ristorante
          </h2>
        </div>
        {auth.state === "loaded" && auth.isAuthentication ? (
          <Link
            to="/orders"
            className={`w-[10rem] ${cn(buttonVariants({ size: "lg" }))}`}
          >
            Controlla i tuoi ordini!
          </Link>
        ) : (
          <Link
            to="/register"
            className={`w-[10rem] ${cn(buttonVariants({ size: "lg" }))}`}
          >
            Inizia ora!
          </Link>
        )}
        <Lottie
          animationData={heroAnimation}
          loop={true}
          style={{ maxWidth: "700px", maxHeight: "700px" }}
        />
      </div>
    </section>
  );
};

export default Hero;
