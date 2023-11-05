import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type RecentOrderRowProps = {
  tableNumber: number;
  totalPrice: string;
};

const RecentOrderRow = ({ tableNumber, totalPrice }: RecentOrderRowProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Avatar className="h-9 w-9">
          <AvatarFallback>{tableNumber}</AvatarFallback>
        </Avatar>
        <p className="font-medium">Tavolo {tableNumber}</p>
      </div>
      <div className="font-medium">€{totalPrice}</div>
    </div>
  );
};

export default RecentOrderRow;
