import { Order } from "@/types/types";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import LoadingState from "@/components/LoadingState";
import ordersService from "@/api/ordersService";
import OrderCard from "@/components/orders/OrderCard";

type OrdersProps = {
  user: User | null | undefined;
};

const Orders = ({ user }: OrdersProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      getOrders();
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const getOrders = () => {
    setIsLoading(true);
    user
      .getIdToken()
      .then((token) => {
        ordersService
          .getOrders(token)
          .then((res) => {
            setOrders(res.data.orders);
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
      <h2 className="text-3xl font-bold tracking-tight">I tuoi ordini</h2>
      {orders.length === 0 && (
        <h2 className="text-xl font-medium tracking-tight">
          Non hai ancora nessun ordine 😐
        </h2>
      )}
      {orders.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {orders.map((order) => (
            <OrderCard order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
