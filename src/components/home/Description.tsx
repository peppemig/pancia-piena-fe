import Lottie from "lottie-react";
import swipeAnimation from "../../assets/swipe-animation.json";

const Description = () => {
  return (
    <section className="container-custom space-y-8 py-12 lg:py-20">
      <h1 className="text-3xl font-bold text-primary lg:text-4xl text-center">
        Cosa aspetti?
      </h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="gap-8 flex items-center justify-center flex-col text-xl">
          <p>
            La soluzione innovativa per rivoluzionare la gestione degli ordini
            all'interno del tuo ristorante. Con un accesso semplice a report
            dettagliati e analisi avanzate, prendere decisioni informate è
            diventato più facile che mai. Unisciti a noi per migliorare
            l'efficienza operativa e offrire un servizio straordinario.
          </p>
          <p>
            Sia che tu gestisca un elegante ristorante o un'accogliente
            caffetteria, Pancia Piena è qui per semplificare il tuo lavoro
            quotidiano.
          </p>
          <p>
            La nostra piattaforma ti permette di ottimizzare i tempi di
            preparazione, ridurre i margini di errore e creare esperienze
            culinarie personalizzate per i tuoi clienti.
          </p>
        </div>
        <div className="flex items-center justify-center">
          {" "}
          <Lottie
            animationData={swipeAnimation}
            loop={true}
            style={{ maxWidth: "700px", maxHeight: "700px" }}
          />
        </div>
      </div>
    </section>
  );
};

export default Description;
