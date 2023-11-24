import ProductCard from "@/components/products/ProductCard";
import { useEffect, useState } from "react";
import productsService from "@/api/productsService";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Product, Category } from "../types/types";
import { useAuthState } from "@/providers/AuthProvider";
import { categories } from "@/constants/constants";
import FilterButton from "../components/create-order/FilterButton";
import AddProductModal from "@/components/products/AddProductModal";
import ProductsSkeletonLoader from "@/components/products/ProductsSkeletonLoader";

const formSchema = z.object({
  name: z.string().min(1).max(50),
  price: z.coerce.number().min(0.05),
  category: z.nativeEnum(Category),
});

const Products = () => {
  const { user } = useAuthState();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentFilter, setCurrentFilter] = useState<string>("TUTTI");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

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

  const filterProducts = (value: string) => {
    if (value === "TUTTI") {
      setFilteredProducts(products);
      setCurrentFilter(value);
      return;
    }
    const filter = products.filter((product) => product.category === value);
    setFilteredProducts(filter);
    setCurrentFilter(value);
  };

  return (
    <div className="container-custom py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">I tuoi prodotti</h2>
        <AddProductModal
          open={open}
          setOpen={setOpen}
          onCreateProduct={onCreateProduct}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.keys(categories).map((cat) => (
          <FilterButton
            key={cat}
            label={categories[cat]}
            value={cat}
            currentFilter={currentFilter}
            onClick={filterProducts}
          />
        ))}
      </div>
      {isLoading && <ProductsSkeletonLoader />}
      {!isLoading && filteredProducts.length === 0 && (
        <h2 className="text-xl font-medium tracking-tight">
          Non hai ancora aggiunto nessun prodotto 😐
        </h2>
      )}
      {!isLoading && filteredProducts.length > 0 && (
        <div className="flex flex-col space-y-8">
          {Object.keys(categories).map(
            (cat) =>
              filteredProducts.some((prod) => prod.category === cat) && (
                <div className="flex flex-col" key={cat}>
                  <h2 className="text-2xl font-bold pb-2">
                    {categories[cat].toUpperCase()}
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {filteredProducts
                      .filter((prod) => prod.category === cat)
                      .map((fprod) => (
                        <ProductCard
                          key={fprod.id}
                          id={fprod.id}
                          name={fprod.name}
                          price={fprod.price}
                          category={fprod.category}
                          user={user!}
                          refreshProducts={getProducts}
                        />
                      ))}
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
