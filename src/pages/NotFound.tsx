import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container-custom flex flex-col items-center justify-center gap-1 pt-20">
      <h1 className="text-9xl font-bold">404</h1>
      <p className="text-2xl flex items-center gap-1">Pagina non trovata</p>
      <Button asChild className="mt-10">
        <Link to="/">Torna alla home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
