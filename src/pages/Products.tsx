import { User } from "firebase/auth";
import { Link, Navigate } from "react-router-dom";
//import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import { buttonVariants } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";

type ProductsProps = {
  user: User | null | undefined;
};

type Product = {
  id: string;
  name: string;
  price: string;
  userId: string;
};

const Products = ({ user }: ProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (user) {
      getProducts();
    }
  }, [user]); // Make sure to include user in the dependency array

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const getProducts = () => {
    user
      .getIdToken()
      .then((token) => {
        axios
          .get("http://localhost:3000/api/v1/products", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => setProducts(res.data.products))
          .catch((e) => console.log(e));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="container-custom pt-6 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">I tuoi prodotti</h2>
        <Link
          to="/products/create"
          className={buttonVariants({ variant: "default" })}
        >
          Aggiungi un prodotto
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
};

export default Products;
