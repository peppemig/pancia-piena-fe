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
import { Calendar as CalendarIcon } from "lucide-react";
import { checkSameDay, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Dashboard = () => {
  const { user } = useAuthState();
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(
    new Date()
  );

  const year = calendarDate!.getFullYear();
  const month = calendarDate!.getMonth() + 1;
  const day = calendarDate!.getDate();

  const [stats, setStats] = useState<Stats>();
  const [ordersForTheDay, setOrdersForTheDay] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();

  const date = new Date(year, month - 1, day);
  const formattedMonthYear = format(date, "MMMM yyyy", { locale: it });
  const formattedDayMonthYear = format(date, "d MMMM yyyy", { locale: it });

  useEffect(() => {
    getStats();
  }, [user, month, year]);

  useEffect(() => {
    if (stats) {
      const dayOrders = stats.graphStats.find(
        (item) => checkSameDay(new Date(item.day), calendarDate!) === true
      );
      setOrdersForTheDay(dayOrders?.ordersForTheDay);
    }
  }, [stats, calendarDate]);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
        <h2 className="text-3xl font-bold tracking-tight">La tua dashboard</h2>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !calendarDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {calendarDate ? (
                format(calendarDate, "PPP", { locale: it })
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              locale={it}
              mode="single"
              selected={calendarDate}
              onSelect={(day: Date | undefined, date: Date) => {
                setCalendarDate(date);
                setOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      {stats && Object.keys(stats).length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <DashboardCard
              type="currency"
              label="Totale guadagni"
              desc={formattedMonthYear}
              value={stats.monthTotal._sum.totalPrice || 0}
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
                {stats.graphStats.length > 0 ? (
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
                ) : (
                  <div>Nessun ordine questo mese</div>
                )}
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
