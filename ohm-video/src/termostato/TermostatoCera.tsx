import narracion from "../../guion/termostato/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Abre,
  Atasca,
  Bucle,
  Cerrada,
  Cierre,
  Gancho,
  T,
} from "./Escenas";

export const DURACION_TERMOSTATO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const TermostatoCera: React.FC = () => (
  <Short
    carpeta="termostato"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.motor, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.motor, hasta: T.valvula, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Cerrada", desde: T.valvula, hasta: T.agua, render: (t0) => <Cerrada t0={t0} /> },
      { nombre: "Abre", desde: T.agua, hasta: T.encoge, render: (t0) => <Abre t0={t0} /> },
      { nombre: "Atasca", desde: T.encoge, hasta: T.asi, render: (t0) => <Atasca t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Dilatación de la cera", T.derrite, T.encoge, C.yellow],
    ]}
    tics={[0.6, T.derrite, T.sobrecalienta]}
  />
);
