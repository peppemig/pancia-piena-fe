import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Order } from "@/types/types";
import { Button } from "../ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { User } from "firebase/auth";
import { useToast } from "@/components/ui/use-toast";
import ordersService from "@/api/ordersService";
import LoadingState from "../LoadingState";

type OrderCardProps = {
  order: Order;
  user: User;
  filter: "in-corso" | "completati";
  refreshOrders: () => void;
};

const OrderCard = ({ order, refreshOrders, user, filter }: OrderCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onDeleteOrder = () => {
    setIsLoading(true);
    user
      .getIdToken()
      .then((token) => {
        ordersService
          .deleteOrder(token, order.id)
          .then(() => refreshOrders())
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

  const onCompleteOrder = () => {
    setIsLoading(true);
    user
      .getIdToken()
      .then((token) => {
        ordersService
          .setOrderToCompleted(token, order.id)
          .then(() => refreshOrders())
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
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">
          Tavolo: {order.tableNumber}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {order.orderItems.map((item) => (
          <p key={item.id} className="text-xl font-medium">
            {item.quantity} x {item.product.name}
          </p>
        ))}
      </CardContent>
      {filter === "in-corso" && (
        <CardFooter className="flex items-center justify-between">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <XCircle />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Conferma</DialogTitle>
                <DialogDescription>
                  Sei sicuro di voler eliminare quest'ordine?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <div className="flex items-center justify-between w-full">
                  <DialogClose asChild>
                    <Button variant="outline">Annulla</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      onClick={onDeleteOrder}
                      variant="destructive"
                      type="submit"
                    >
                      Si
                    </Button>
                  </DialogClose>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={onCompleteOrder} variant="outline" size="icon">
            <CheckCircle2 />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default OrderCard;
