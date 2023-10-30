import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
//import { Input } from "@/components/ui/input";
//import { Label } from "@/components/ui/label";
import { User } from "firebase/auth";
import productsService from "@/api/productsService";
import { useState } from "react";
import LoadingState from "../LoadingState";

type ProductCardProps = {
  id: string;
  name: string;
  price: string;
  user: User;
  refreshProducts: () => void;
};

const ProductCard = ({
  id,
  name,
  price,
  user,
  refreshProducts,
}: ProductCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onDeleteProduct = () => {
    setIsLoading(true);
    user
      .getIdToken()
      .then((token) => {
        productsService
          .deleteProduct(token, id)
          .then(() => refreshProducts())
          .catch(() => setIsLoading(false));
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-lg font-medium">€{price}</div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Modifica</Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Elimina</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Conferma</DialogTitle>
              <DialogDescription>
                Sei sicuro di voler eliminare questo prodotto?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <div className="flex items-center justify-between w-full">
                <DialogClose asChild>
                  <Button variant="outline">Annulla</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    onClick={onDeleteProduct}
                    variant="destructive"
                    type="submit"
                  >
                    Si
                  </Button>
                </DialogClose>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
