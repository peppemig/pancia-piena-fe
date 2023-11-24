import productsService from "@/api/productsService";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product, OrderItem } from "../types/types";
import ordersService from "@/api/ordersService";
import { io, Socket } from "socket.io-client";
import { ORIGIN_URL, categories } from "@/constants/constants";
import { useAuthState } from "@/providers/AuthProvider";
import OrderItemRow from "@/components/create-order/OrderItemRow";
import FilterButton from "@/components/create-order/FilterButton";
import { Skeleton } from "@/components/ui/skeleton";

const CreateOrder = () => {
  const { user } = useAuthState();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentFilter, setCurrentFilter] = useState<string>("TUTTI");
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    getProducts();
  }, [user]);

  useEffect(() => {
    let socket: Socket;

    const connectToSocket = async () => {
      const token = await user!.getIdToken();
      socket = io(ORIGIN_URL, {
        autoConnect: false,
        query: { token: token },
      });

      socket.connect();
      setSocket(socket);
    };

    connectToSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]);

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

  const createOrder = () => {
    if (tableNumber === null) {
      return;
    }
    setIsLoading(true);
    user!
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

  //if (isLoading) {
  //  return <LoadingState />;
  //}

  return (
    <div className="container-custom py-6 space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Crea un ordine</h2>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-4">
        {isLoading && (
          <div className="col-span-2 space-y-2">
            <Skeleton className="p-6 rounded-lg h-60" />
            <Skeleton className="p-6 rounded-lg h-60" />
            <Skeleton className="p-6 rounded-lg h-60" />
          </div>
        )}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="col-span-2 p-6 rounded-lg border bg-card text-card-foreground shadow-sm w-full">
            <p className="text-xl font-bold">Nessun prodotto trovato</p>
          </div>
        )}
        {!isLoading && filteredProducts.length > 0 && (
          <>
            <div className="col-span-2 space-y-2">
              {Object.keys(categories).map(
                (cat) =>
                  filteredProducts.some((prod) => prod.category === cat) && (
                    <div
                      key={cat}
                      className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm w-full h-fit"
                    >
                      <h2 className="text-2xl font-bold pb-2">
                        {categories[cat].toUpperCase()}
                      </h2>
                      {filteredProducts
                        .filter((prod) => prod.category === cat)
                        .map((fprod, index, arr) => (
                          <div key={fprod.id}>
                            <OrderItemRow
                              product={fprod}
                              orderItems={orderItems}
                              addQty={addQuantity}
                              removeQty={removeQuantity}
                            />
                            {index !== arr.length - 1 && (
                              <Separator
                                key={`sep-${fprod.id}`}
                                className="my-2"
                              />
                            )}
                          </div>
                        ))}
                    </div>
                  )
              )}
            </div>
          </>
        )}
        <div className="sticky mt-2 md:mt-0 top-20 h-fit col-span-1 p-6 space-y-4 rounded-lg border bg-card text-card-foreground shadow-sm w-full">
          {isLoading && <Skeleton className="h-40" />}
          {!isLoading && filteredProducts.length === 0 && (
            <p className="font-semibold">
              Aggiungi dei prodotti per poter effettuare un ordine
            </p>
          )}
          {!isLoading && filteredProducts.length > 0 && (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
