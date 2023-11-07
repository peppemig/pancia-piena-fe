//import { User } from "firebase/auth";
//import { Navigate } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/products/ProductCard";
import { useEffect, useState } from "react";
import productsService from "@/api/productsService";
import LoadingState from "@/components/LoadingState";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Product, Category } from "../types/types";
import { useAuthState } from "@/providers/AuthProvider";

//type ProductsProps = {
//  user: User | null | undefined;
//};

const formSchema = z.object({
  name: z.string().min(1).max(50),
  price: z.coerce.number().min(0.05),
  category: z.nativeEnum(Category),
});

const Products = () => {
  const { user } = useAuthState();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      category: undefined,
    },
  });

  useEffect(() => {
    getProducts();
  }, [user]);

  const onCreateProduct = (values: z.infer<typeof formSchema>) => {
    setOpen(false);
    user!
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
    user!
      .getIdToken()
      .then((token) => {
        productsService
          .getProducts(token)
          .then((res) => {
            setProducts(res.data.products);
            setFilteredProducts(res.data.products);
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
                Inserisci nome, prezzo e categoria ed aggiungi un nuovo prodotto
                al tuo menu
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
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-md font-semibold leading-none tracking-tight">
                        Categoria
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona una categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ANTIPASTO">Antipasto</SelectItem>
                          <SelectItem value="PRIMO">Primo</SelectItem>
                          <SelectItem value="SECONDO">Secondo</SelectItem>
                          <SelectItem value="DOLCE">Dolce</SelectItem>
                          <SelectItem value="BEVANDA">Bevanda</SelectItem>
                        </SelectContent>
                      </Select>
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
      <div className="flex items-center gap-4">
        <p className="text-lg font-semibold">Filtra prodotti per categoria:</p>
        <Select
          onValueChange={(value) => {
            if (value === "TUTTI") {
              setFilteredProducts(products);
              return;
            }
            const filter = products.filter(
              (product) => product.category === value
            );
            setFilteredProducts(filter);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleziona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TUTTI">Tutti</SelectItem>
            <SelectItem value="ANTIPASTO">Antipasti</SelectItem>
            <SelectItem value="PRIMO">Primi</SelectItem>
            <SelectItem value="SECONDO">Secondi</SelectItem>
            <SelectItem value="DOLCE">Dolci</SelectItem>
            <SelectItem value="BEVANDA">Bevande</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {filteredProducts.length === 0 && (
        <h2 className="text-xl font-medium tracking-tight">
          Non hai ancora aggiunto nessun prodotto 😐
        </h2>
      )}
      {filteredProducts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              category={product.category}
              user={user!}
              refreshProducts={getProducts}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
