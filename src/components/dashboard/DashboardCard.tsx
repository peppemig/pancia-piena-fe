import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DasboardCardProps = {
  label: string;
  value: number;
  desc: string;
  type: "currency" | "stat";
};

const DashboardCard = ({ label, value, type, desc }: DasboardCardProps) => {
  return (
    <Card>
      <CardHeader className="space-y-0 pb-2">
        <CardTitle className="text-md font-medium">{label}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {type === "currency" ? "€" : ""}
          {value}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
