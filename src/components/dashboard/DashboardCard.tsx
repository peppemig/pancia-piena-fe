import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DasboardCardProps = {
  label: string;
  value: number;
  percentage: number;
  type: "currency" | "stat";
};

const DashboardCard = ({
  label,
  value,
  percentage,
  type,
}: DasboardCardProps) => {
  return (
    <Card>
      <CardHeader className="space-y-0 pb-2">
        <CardTitle className="text-md font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {type === "currency" ? "€" : ""}
          {value}
        </div>
        <p className="text-xs text-muted-foreground">
          +{percentage}% rispetto al mese scorso
        </p>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
