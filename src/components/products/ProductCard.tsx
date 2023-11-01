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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User } from "firebase/auth";
import productsService from "@/api/productsService";
import { useState } from "react";
import LoadingState from "../LoadingState";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  user: User;
  refreshProducts: () => void;
};

const formSchema = z.object({
  name: z.string().min(1).max(50),
  price: z.coerce.number().min(0.05),
});

const ProductCard = ({
  id,
  name,
  price,
  user,
  refreshProducts,
}: ProductCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
      price: price,
    },
  });

  const onDeleteProduct = () => {
    setIsLoading(true);
    user
      .getIdToken()
      .then((token) => {
        productsService
          .deleteProduct(token, id)
          .then(() => refreshProducts())
          .catch(() => {
            setIsLoading(false);
            toast({
              variant: "destructive",
              title: "Ooops! Qualcosa è andato storto",
              description: "Prova ad effettuare nuovamente la richiesta",
            });
          });
      })
      .catch(() => {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Ooops! Qualcosa è andato storto",
          description: "Prova ad effettuare nuovamente la richiesta",
        });
      });
  };

  const onEditProduct = (values: z.infer<typeof formSchema>) => {
    user
      .getIdToken()
      .then((token) => {
        productsService
          .editProduct(token, id, values)
          .then(() => {
            setIsLoading(false);
            refreshProducts();
          })
          .catch(() => {
            setIsLoading(false);
            toast({
              variant: "destructive",
              title: "Ooops! Qualcosa è andato storto",
              description: "Prova ad effettuare nuovamente la richiesta",
            });
          });
      })
      .catch(() => {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Ooops! Qualcosa è andato storto",
          description: "Prova ad effettuare nuovamente la richiesta",
        });
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
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Modifica</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Modifica prodotto</DialogTitle>
              <DialogDescription>
                Modifica i dati del prodotto
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onEditProduct)}
                className="space-y-4 w-full"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-md font-semibold leading-none tracking-tight">
                        Nome
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="text-md"
                          placeholder=""
                          {...field}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-md font-semibold leading-none tracking-tight">
                        Prezzo
                      </FormLabel>
                      <FormControl>
                        <Input
                          step="0.01"
                          type="number"
                          className="text-md"
                          placeholder=""
                          {...field}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" type="submit">
                  Salva modifiche
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
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
