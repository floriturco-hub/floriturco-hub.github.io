import narracion from "../../guion/mandarina/narracion.json";
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
  Compartimento,
  Flor,
  Gancho,
  Madurar,
  Pectina,
  T,
} from "./Escenas";

export const DURACION_MANDARINA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const MandarinaGajos: React.FC = () => (
  <Short
    carpeta="mandarina"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.mandarina, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.mandarina, hasta: T.compartimento, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Compartimento", desde: T.compartimento, hasta: T.pulpa, render: (t0) => <Compartimento t0={t0} /> },
      { nombre: "Pectina", desde: T.pulpa, hasta: T.madurar, render: (t0) => <Pectina t0={t0} /> },
      { nombre: "Madurar", desde: T.madurar, hasta: T.flor, render: (t0) => <Madurar t0={t0} /> },
      { nombre: "Flor", desde: T.flor, hasta: T.porEso, render: (t0) => <Flor t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Pectina: pegamento vegetal", T.pectina, T.madurar, C.yellow],
      ["Maduración", T.enzimas, T.flor, C.white],
    ]}
    tics={[0.6, T.compartimento, T.despegan]}
  />
);
