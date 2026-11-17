import narracion from "../../guion/piedrarebota/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Cierre,
  Gancho,
  Giro,
  Masa,
  Rampa,
  Record,
  T,
} from "./Escenas";

export const DURACION_PIEDRA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const PiedraRebota: React.FC = () => (
  <Short
    carpeta="piedrarebota"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.lanzas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.lanzas, hasta: T.dura, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Masa del agua", desde: T.dura, hasta: T.llega, render: (t0) => <Masa t0={t0} /> },
      { nombre: "Rampa", desde: T.llega, hasta: T.giro, render: (t0) => <Rampa t0={t0} /> },
      { nombre: "Giro", desde: T.giro, hasta: T.rebote, render: (t0) => <Giro t0={t0} /> },
      { nombre: "Récord", desde: T.rebote, hasta: T.porEso, render: (t0) => <Record t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Inercia del agua", T.masa, T.llega, C.white],
      ["Efecto giroscópico", T.giro, T.rebote, C.yellow],
    ]}
    tics={[0.6, T.rampa, T.record]}
  />
);
