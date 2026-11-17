import narracion from "../../guion/puerta/narracion.json";
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
  Corta,
  Cortina,
  Esfuerzo,
  Gancho,
  Garaje,
  Viejos,
  T,
} from "./Escenas";

export const DURACION_PUERTA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const PuertaSensor: React.FC = () => (
  <Short
    carpeta="puerta"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.metes, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.metes, hasta: T.lados, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Cortina de luz", desde: T.lados, hasta: T.corta, render: (t0) => <Cortina t0={t0} /> },
      { nombre: "Corte", desde: T.corta, hasta: T.portones, render: (t0) => <Corta t0={t0} /> },
      { nombre: "Garaje", desde: T.portones, hasta: T.falla, render: (t0) => <Garaje t0={t0} /> },
      { nombre: "Esfuerzo", desde: T.falla, hasta: T.viejos, render: (t0) => <Esfuerzo t0={t0} /> },
      { nombre: "Barra antigua", desde: T.viejos, hasta: T.asi, render: (t0) => <Viejos t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Cortina infrarroja", T.cortina, T.corta, C.red],
      ["Fotocélula", T.suelo, T.falla, C.red],
      ["Sensor de carga", T.esfuerzo, T.viejos, C.white],
    ]}
    tics={[0.7, T.invierte, T.detiene, T.tocarte]}
  />
);
