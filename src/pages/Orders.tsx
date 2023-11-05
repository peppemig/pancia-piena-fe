import { Order } from "@/types/types";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import LoadingState from "@/components/LoadingState";
import ordersService from "@/api/ordersService";
import OrderCard from "@/components/orders/OrderCard";
import { Button } from "@/components/ui/button";
import { io, Socket } from "socket.io-client";
import { ORIGIN_URL } from "@/constants/constants";

type OrdersProps = {
  user: User | null | undefined;
};

type OrderFilter = "in-corso" | "completati";

const Orders = ({ user }: OrdersProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ordersFilter, setOrdersFilter] = useState<OrderFilter>("in-corso");
  const [socket, setSocket] = useState<Socket | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      getOrders();
    }
  }, [user, ordersFilter]);

  useEffect(() => {
    socket?.on("order-received", () => {
      getOrders();
    });
  }, [socket]);

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

  const getOrders = () => {
    setIsLoading(true);
    user
      .getIdToken()
      .then((token) => {
        const fetchOrders =
          ordersFilter === "in-corso"
            ? ordersService.getOrders(token)
            : ordersService.getCompletedOrders(token);

        fetchOrders
          .then((res) => {
            setOrders(res.data.orders);
          })
          .catch(() => {
            toast({
              variant: "destructive",
              title: "Ooops! Qualcosa è andato storto",
              description: "Prova ad effettuare nuovamente la richiesta",
            });
          })
          .finally(() => {
            setIsLoading(false);
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
      <div className="flex items-center gap-2">
        <Button
          onClick={() => {
            if (ordersFilter === "in-corso") return;
            setOrdersFilter("in-corso");
          }}
          variant={ordersFilter === "in-corso" ? "default" : "secondary"}
        >
          In corso
        </Button>
        <Button
          onClick={() => {
            if (ordersFilter === "completati") return;
            setOrdersFilter("completati");
          }}
          variant={ordersFilter === "completati" ? "default" : "secondary"}
        >
          Completati
        </Button>
      </div>
      {orders.length === 0 && (
        <h2 className="text-xl font-medium tracking-tight">
          Non hai ancora nessun ordine 😐
        </h2>
      )}
      {orders.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {orders.map((order) => (
            <OrderCard
              filter={ordersFilter}
              key={order.id}
              order={order}
              refreshOrders={getOrders}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
