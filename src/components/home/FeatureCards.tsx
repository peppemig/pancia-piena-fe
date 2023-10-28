import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Clock, UtensilsCrossed, AreaChart } from "lucide-react";
//import animation from "../../assets/hero-animation.json";

const FeatureCards = () => {
  return (
    <section className="bg-slate-50 dark:bg-slate-900">
      <div className="container-custom space-y-8 py-12 text-center lg:py-20">
        <h1 className="text-3xl font-bold text-primary lg:text-4xl">
          I vantaggi che ti offriamo
        </h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="flex flex-grow flex-col items-center justify-center gap-4 p-8 dark:bg-secondary">
            <Clock size={50} />
            <div className="space-y-2">
              <CardTitle>Efficienza</CardTitle>
              <CardDescription>
                Gestisci i tuoi ordini in modo più veloce ed efficace
              </CardDescription>
            </div>
          </Card>
          <Card className="flex flex-grow flex-col items-center justify-center gap-4 p-8 dark:bg-secondary">
            <UtensilsCrossed size={50} />
            <div className="space-y-2">
              <CardTitle>Personalizzazione</CardTitle>
              <CardDescription>
                Crea esperienze culinarie personalizzate per i tuoi clienti
              </CardDescription>
            </div>
          </Card>
          <Card className="flex flex-grow flex-col items-center justify-center gap-4 p-8 dark:bg-secondary">
            <AreaChart size={50} />
            <div className="space-y-2">
              <CardTitle>Reporting</CardTitle>
              <CardDescription>
                Consulta il report con dati accurati e insight chiari
              </CardDescription>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
