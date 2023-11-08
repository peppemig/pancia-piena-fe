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
import { useAuthState } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";

const checkSameDay = (firstDate: Date, secondDate: Date) => {
  return (
    firstDate.getDate() === secondDate.getDate() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getFullYear() === secondDate.getFullYear()
  );
};

const Dashboard = () => {
  const { user } = useAuthState();
  const [year, setYear] = useState(new Date().getUTCFullYear());
  const [month, setMonth] = useState(new Date().getUTCMonth() + 1);
  const [day, setDay] = useState(new Date().getUTCDate());
  const [stats, setStats] = useState<Stats>();
  const [ordersForTheDay, setOrdersForTheDay] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();

  const date = new Date(year, month - 1, day);
  const formattedMonthYear = format(date, "MMMM yyyy", { locale: it });
  const formattedDayMonthYear = format(date, "d MMMM yyyy", { locale: it });

  useEffect(() => {
    getStats();
  }, [user]);

  useEffect(() => {
    if (stats) {
      const dayOrders = stats.graphStats.find(
        (item) => checkSameDay(new Date(item.day), new Date()) === true
      );
      setOrdersForTheDay(dayOrders?.ordersForTheDay);
    }
  }, [stats]);

  const getStats = () => {
    setIsLoading(true);
    user!
      .getIdToken()
      .then((token) => {
        statsService
          .getStats(token, year, month)
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
              value={stats.monthTotal._sum.totalPrice}
            />
            <DashboardCard
              type="stat"
              label="Totale ordini"
              desc={formattedMonthYear}
              value={stats.graphStats.reduce(
                (total, item) => total + item.ordersForTheDay,
                0
              )}
            />
            <DashboardCard
              type="stat"
              label="Ordini oggi"
              desc={formattedDayMonthYear}
              value={ordersForTheDay || 0}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-2 lg:col-span-4">
              <CardHeader>
                <CardTitle>Panoramica mensile</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="95%" height={450}>
                  <BarChart data={stats.graphStats}>
                    <XAxis
                      label={{
                        value: "Giorno",
                        position: "insideBottomRight",
                        dy: 10,
                      }}
                      dataKey="day"
                      stroke={theme === "dark" ? "#F8FAFC" : "#020817"}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) =>
                        `${
                          new Date(value).getDate() +
                          "-" +
                          (new Date(value).getMonth() + 1)
                        }`
                      }
                    />
                    <YAxis
                      label={{
                        value: "N. ordini",
                        position: "insideLeft",
                        angle: -90,
                      }}
                      stroke={theme === "dark" ? "#F8FAFC" : "#020817"}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Bar
                      dataKey="ordersForTheDay"
                      fill={theme === "dark" ? "#1E293B" : "#F1F5F9"}
                      radius={[4, 4, 0, 0]}
                    />
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
