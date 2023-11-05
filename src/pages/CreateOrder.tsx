import productsService from "@/api/productsService";
import { User } from "firebase/auth";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import LoadingState from "@/components/LoadingState";
import { PlusCircle, MinusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product, OrderItem } from "../types/types";
import ordersService from "@/api/ordersService";
import { io, Socket } from "socket.io-client";
import { ORIGIN_URL } from "@/constants/constants";

type CreateOrderProps = {
  user: User | null | undefined;
};

const CreateOrder = ({ user }: CreateOrderProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      getProducts();
    }
  }, [user]);

  useEffect(() => {
    let socket: Socket;

    if (user) {
      const connectToSocket = async () => {
        const token = await user.getIdToken();
        socket = io(ORIGIN_URL, {
          autoConnect: false,
          query: { token: token },
        });

        socket.connect();
        setSocket(socket);
      };

      connectToSocket();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]);

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

  const createOrder = () => {
    if (tableNumber === null) {
      return;
    }
    setIsLoading(true);
    user
      .getIdToken()
      .then((token) => {
        ordersService
          .createOrder(token, { tableNumber, orderItems })
          .then(() => {
            socket?.emit("order-created");
            setFilteredProducts(products);
            setTableNumber(null);
            setOrderItems([]);
            setIsLoading(false);
            toast({
              variant: "default",
              title: "Ordine creato",
              description:
                "Puoi controllare il tuo ordine nella relativa schermata",
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
      {filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-4">
          <div className="col-span-2 p-6 space-y-4 rounded-lg border bg-card text-card-foreground shadow-sm w-full h-fit">
            {filteredProducts.map((product, index) => (
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
                {index !== filteredProducts.length - 1 && (
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
            <div className="flex flex-col gap-2">
              <Label className="text-lg font-medium" htmlFor="numberoTavolo">
                Numero tavolo
              </Label>
              <Input
                value={tableNumber || ""}
                onChange={(e) => setTableNumber(parseInt(e.target.value))}
                min="1"
                type="number"
                id="numeroTavolo"
                placeholder="Inserisci il numero del tavolo"
              />
            </div>
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
            <Button
              onClick={createOrder}
              disabled={
                orderItems.length === 0 ||
                tableNumber === null ||
                isNaN(tableNumber)
              }
              className="w-full"
            >
              Effettua ordine
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrder;
