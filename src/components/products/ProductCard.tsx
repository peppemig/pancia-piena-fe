import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProductCardProps = {
  name: string;
  price: string;
};

const ProductCard = ({ name, price }: ProductCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-lg font-medium">€{price}</div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
