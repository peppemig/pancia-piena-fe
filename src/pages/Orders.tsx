import { Order } from "@/types/types";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import ordersService from "@/api/ordersService";
import OrderCard from "@/components/orders/OrderCard";
import { Button } from "@/components/ui/button";
import { io, Socket } from "socket.io-client";
import { ORIGIN_URL } from "@/constants/constants";
import { useAuthState } from "@/providers/AuthProvider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OrderCardSkeleton from "@/components/orders/OrderCardSkeleton";

type OrderFilter = "in-corso" | "completati";

const Orders = () => {
  const { user } = useAuthState();
  const [ordersData, setOrdersData] = useState<{
    orders: Order[];
    totalPages?: number;
  }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNewOrder, setIsLoadingNewOrder] = useState(false);
  const [ordersFilter, setOrdersFilter] = useState<OrderFilter>("in-corso");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [page, setPage] = useState(1);

  const { toast } = useToast();

  useEffect(() => {
    getOrders(true);
  }, [user, ordersFilter, page]);

  useEffect(() => {
    socket?.on("order-received", () => {
      getOrders(false);
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

  const getOrders = (isInitial: boolean) => {
    isInitial ? setIsLoading(true) : setIsLoadingNewOrder(true);
    user!
      .getIdToken()
      .then((token) => {
        const fetchOrders =
          ordersFilter === "in-corso"
            ? ordersService.getOrders(token)
            : ordersService.getCompletedOrdersPaginated(token, page);

        fetchOrders
          .then((res) => {
            setOrdersData(res.data.ordersData);
          })
          .catch(() => {
            toast({
              variant: "destructive",
              title: "Ooops! Qualcosa è andato storto",
              description: "Prova ad effettuare nuovamente la richiesta",
            });
          })
          .finally(() => {
            isInitial ? setIsLoading(false) : setIsLoadingNewOrder(false);
          });
      })
      .catch(() => {
        isInitial ? setIsLoading(false) : setIsLoadingNewOrder(false);
        toast({
          variant: "destructive",
          title: "Ooops! Qualcosa è andato storto",
          description: "Prova ad effettuare nuovamente la richiesta",
        });
      });
  };

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
            setPage(1);
            setOrdersFilter("completati");
          }}
          variant={ordersFilter === "completati" ? "default" : "secondary"}
        >
          Completati
        </Button>
      </div>
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <OrderCardSkeleton qty={4} />
        </div>
      )}
      {!isLoading && ordersData && ordersData.orders.length > 0 && (
        <>
          {ordersFilter === "completati" && (
            <div className="flex items-center justify-center">
              <Button
                variant="ghost"
                disabled={page === 1}
                onClick={() => {
                  if (page === 1) return;
                  setPage((prev) => prev - 1);
                }}
              >
                <ChevronLeft size={30} />
              </Button>
              <p className="text-lg font-medium tracking-tight">
                Pagina {page} di {ordersData.totalPages}
              </p>
              <Button
                variant="ghost"
                disabled={page === ordersData.totalPages}
                onClick={() => {
                  if (page === ordersData.totalPages) return;
                  setPage((prev) => prev + 1);
                }}
              >
                <ChevronRight size={30} />
              </Button>
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {ordersData.orders.map((order) => (
              <OrderCard
                filter={ordersFilter}
                key={order.id}
                order={order}
                refreshOrders={getOrders}
                user={user!}
                setIsLoadingNewOrder={setIsLoadingNewOrder}
                ordersData={ordersData}
                setOrdersData={setOrdersData}
              />
            ))}
            {isLoadingNewOrder && <OrderCardSkeleton />}
          </div>
        </>
      )}
      {!isLoading && ordersData && ordersData.orders.length === 0 && (
        <h2 className="text-xl font-medium tracking-tight">
          Non hai ancora nessun ordine 😐
        </h2>
      )}
    </div>
  );
};

export default Orders;
