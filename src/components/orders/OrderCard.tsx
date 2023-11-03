import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Order } from "@/types/types";
CheckCircle2;
import { Button } from "../ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

type OrderCardProps = {
  order: Order;
};

const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">
          Tavolo: {order.tableNumber}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {order.orderItems.map((item) => (
          <p className="text-xl font-medium">
            {item.quantity} x {item.product.name}
          </p>
        ))}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button variant="outline" size="icon">
          <XCircle />
        </Button>
        <Button variant="outline" size="icon">
          <CheckCircle2 />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
