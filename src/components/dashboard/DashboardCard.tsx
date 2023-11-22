import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

type DasboardCardProps = {
  label: string;
  value: number | undefined;
  desc: string;
  type: "currency" | "stat";
  isLoading: boolean;
};

const DashboardCard = ({
  label,
  value,
  type,
  desc,
  isLoading,
}: DasboardCardProps) => {
  return (
    <Card>
      <CardHeader className="space-y-0 pb-2">
        <CardTitle className="text-md font-medium">{label}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {isLoading ? (
            <Skeleton className="h-10" />
          ) : (
            <p>
              {type === "currency" ? "€" : ""}
              {value}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
