import { Button } from "@/components/ui/button";
import { OrderItem, Product } from "../../types/types";
import { PlusCircle, MinusCircle } from "lucide-react";

type OrderItemRowProps = {
  product: Product;
  orderItems: OrderItem[];
  removeQty: (product: Product) => void;
  addQty: (product: Product) => void;
};

const OrderItemRow = ({
  product,
  addQty,
  removeQty,
  orderItems,
}: OrderItemRowProps) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xl font-medium">{product.name}</p>
          <p className="text-lg font-medium">€{product.price}</p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Button
            disabled={!orderItems.some((item) => item.productId === product.id)}
            variant="ghost"
            onClick={() => removeQty(product)}
          >
            <MinusCircle size={30} />
          </Button>
          <p className="text-lg font-medium">
            {orderItems.find((item) => item.productId === product.id)
              ?.quantity ?? 0}
          </p>
          <Button variant="ghost" onClick={() => addQty(product)}>
            <PlusCircle size={30} />
          </Button>
        </div>
      </div>
      {/*
      {index !== filteredProducts.length - 1 && <Separator className="mt-4" />}
      */}
    </div>
  );
};

export default OrderItemRow;
