import { User } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardCard from "@/components/dashboard/DashboardCard";

type DashboardProps = {
  user: User | null | undefined;
};

const Dashboard = ({ user }: DashboardProps) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container-custom py-6 space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">La tua dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          type="currency"
          label="Totale guadagni"
          value={10000.55}
          percentage={20}
        />
        <DashboardCard
          type="stat"
          label="Totale ordini"
          value={462}
          percentage={20}
        />
        <DashboardCard
          type="stat"
          label="Ordini oggi"
          value={51}
          percentage={20}
        />
        <DashboardCard
          type="stat"
          label="Ordini annullati"
          value={6}
          percentage={20}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Panoramica</CardTitle>
          </CardHeader>
        </Card>
        <Card className="col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Vendite recenti</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
