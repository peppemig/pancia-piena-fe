import productsService from "@/api/productsService";
import { User } from "firebase/auth";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import LoadingState from "@/components/LoadingState";
import { PlusCircle, MinusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type CreateOrderProps = {
  user: User | null | undefined;
};

type Product = {
  id: string;
  name: string;
  price: number;
  userId: string;
  category: Category;
};

enum Category {
  ANTIPASTO = "ANTIPASTO",
  PRIMO = "PRIMO",
  SECONDO = "SECONDO",
  DOLCE = "DOLCE",
  BEVANDA = "BEVANDA",
}

type OrderItem = {
  productId: string;
  quantity: number;
  productName: string;
  productPrice: number;
};

const CreateOrder = ({ user }: CreateOrderProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      getProducts();
    }
  }, [user]);

  useEffect(() => {
    console.log(orderItems);
  }, [orderItems]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

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

  const addQuantity = (product: Product) => {
    const itemIndex = orderItems.findIndex(
      (item) => item.productId === product.id
    );
    if (itemIndex !== -1) {
      const updatedOrderItems = [...orderItems];
      updatedOrderItems[itemIndex].quantity += 1;
      setOrderItems(updatedOrderItems);
    } else {
      setOrderItems((prev) => [
        ...prev,
        {
          productId: product.id,
          quantity: 1,
          productName: product.name,
          productPrice: product.price,
        },
      ]);
    }
  };

  const removeQuantity = (product: Product) => {
    const updatedOrderItems = [...orderItems];
    const itemIndex = updatedOrderItems.findIndex(
      (item) => item.productId === product.id
    );
    if (itemIndex !== -1) {
      if (updatedOrderItems[itemIndex].quantity === 1) {
        updatedOrderItems.splice(itemIndex, 1);
      } else {
        updatedOrderItems[itemIndex].quantity -= 1;
      }
      setOrderItems(updatedOrderItems);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="container-custom py-6 space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Crea un ordine</h2>
      {products.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-4">
          <div className="col-span-2 p-6 space-y-4 rounded-lg border bg-card text-card-foreground shadow-sm w-full h-fit">
            {products.map((product, index) => (
              <div key={product.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold">{product.name}</p>
                    <p className="text-lg font-medium">€{product.price}</p>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      disabled={
                        !orderItems.some(
                          (item) => item.productId === product.id
                        )
                      }
                      variant="ghost"
                      onClick={() => removeQuantity(product)}
                    >
                      <MinusCircle size={30} />
                    </Button>
                    <p className="text-lg font-medium">
                      {orderItems.find((item) => item.productId === product.id)
                        ?.quantity ?? 0}
                    </p>
                    <Button
                      variant="ghost"
                      onClick={() => addQuantity(product)}
                    >
                      <PlusCircle size={30} />
                    </Button>
                  </div>
                </div>
                {index !== products.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </div>
          <div className="sticky mt-2 lg:mt-0 top-6 h-fit col-span-1 p-6 space-y-4 rounded-lg border bg-card text-card-foreground shadow-sm w-full">
            <p className="text-xl font-bold">Riepilogo ordine</p>
            {orderItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <p className="text-lg font-medium">{item.productName}</p>
                  <p className="text-md">Quantità: {item.quantity}</p>
                </div>
                <p className="text-lg font-bold">
                  €{item.quantity * item.productPrice}
                </p>
              </div>
            ))}
            <Separator />
            <div className="flex items-center justify-between text-xl font-bold">
              <p>Totale:</p>
              <p>
                €
                {orderItems.reduce(
                  (total, item) => total + item.quantity * item.productPrice,
                  0
                )}
              </p>
            </div>
            <Button disabled={orderItems.length === 0} className="w-full">
              Effettua ordine
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrder;
