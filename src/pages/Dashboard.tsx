import { User } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { ResponsiveContainer, Bar, BarChart, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import statsService from "@/api/statsService";
import { useToast } from "@/components/ui/use-toast";
import LoadingState from "@/components/LoadingState";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import RecentOrderRow from "@/components/dashboard/RecentOrderRow";
import { Stats } from "@/types/types";

const data = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jul",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Aug",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Sep",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Oct",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Dec",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
];

type DashboardProps = {
  user: User | null | undefined;
};

const Dashboard = ({ user }: DashboardProps) => {
  const [year, setYear] = useState(new Date().getUTCFullYear());
  const [month, setMonth] = useState(new Date().getUTCMonth() + 1);
  const [day, setDay] = useState(new Date().getUTCDate());
  const [stats, setStats] = useState<Stats>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const date = new Date(year, month - 1, day);
  const formattedMonthYear = format(date, "MMMM yyyy", { locale: it });
  const formattedDayMonthYear = format(date, "d MMMM yyyy", { locale: it });

  useEffect(() => {
    if (user) {
      getStats();
    }
  }, []);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const getStats = () => {
    setIsLoading(true);
    user
      .getIdToken()
      .then((token) => {
        statsService
          .getStats(token, year, month, day)
          .then((res) => {
            setStats(res.data.stats);
            setIsLoading(false);
          })
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
    <div className="container-custom py-6 space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">La tua dashboard</h2>
      {stats && Object.keys(stats).length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <DashboardCard
              type="currency"
              label="Totale guadagni"
              desc={formattedMonthYear}
              value={stats.monthlyStats._sum.totalPrice}
            />
            <DashboardCard
              type="stat"
              label="Totale ordini"
              desc={formattedMonthYear}
              value={stats.monthlyStats._count}
            />
            <DashboardCard
              type="stat"
              label="Ordini oggi"
              desc={formattedDayMonthYear}
              value={stats.dailyOrders}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-2 lg:col-span-4">
              <CardHeader>
                <CardTitle>Panoramica (TO-DO)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="95%" height={450}>
                  <BarChart data={data}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `€${value}`}
                    />
                    <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-2 lg:col-span-3 h-fit">
              <CardHeader>
                <CardTitle>Ordini recenti</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {stats.last5Orders.map((order) => (
                    <RecentOrderRow
                      key={order.id}
                      tableNumber={order.tableNumber}
                      totalPrice={order.totalPrice}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
