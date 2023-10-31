import { User } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import ProductCard from "@/components/products/ProductCard";
import { useEffect, useState } from "react";
import productsService from "@/api/productsService";
import LoadingState from "@/components/LoadingState";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";

type ProductsProps = {
  user: User | null | undefined;
};

type Product = {
  id: string;
  name: string;
  price: string;
  userId: string;
};

const formSchema = z.object({
  name: z.string().min(1).max(50),
  price: z.coerce.number().min(0.05),
});

const Products = ({ user }: ProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
    },
  });

  useEffect(() => {
    if (user) {
      getProducts();
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const onCreateProduct = (values: z.infer<typeof formSchema>) => {
    setOpen(false);
    user
      .getIdToken()
      .then((token) => {
        productsService
          .createProduct(token, values)
          .then(() => {
            setIsLoading(false);
            getProducts();
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

  const getProducts = () => {
    setIsLoading(true);
    user
      .getIdToken()
      .then((token) => {
        productsService
          .getProducts(token)
          .then((res) => {
            setProducts(res.data.products);
            setIsLoading(false);
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
    <div className="container-custom py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">I tuoi prodotti</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Aggiungi un prodotto</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Aggiungi un prodotto</DialogTitle>
              <DialogDescription>
                Inserisci nome e prezzo ed aggiungi un nuovo prodotto al tuo
                menu
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onCreateProduct)}
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
                        <Input className="text-md" placeholder="" {...field} />
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" type="submit">
                  Aggiungi
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      {products.length === 0 && (
        <h2 className="text-xl font-medium tracking-tight">
          Non hai ancora aggiunto nessun prodotto 😐
        </h2>
      )}
      {products.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              user={user}
              refreshProducts={getProducts}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
