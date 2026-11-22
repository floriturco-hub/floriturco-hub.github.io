import narracion from "../../guion/winglets/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Ahorro,
  Bucle,
  Cierre,
  Gancho,
  Presion,
  Remolino,
  Winglet,
  T,
} from "./Escenas";

export const DURACION_WINGLETS_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const Winglets: React.FC = () => (
  <Short
    carpeta="winglets"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.aviones, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.aviones, hasta: T.ala, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Presión", desde: T.ala, hasta: T.remolino, render: (t0) => <Presion t0={t0} /> },
      { nombre: "Vórtice", desde: T.remolino, hasta: T.winglet, render: (t0) => <Remolino t0={t0} /> },
      { nombre: "Winglet", desde: T.winglet, hasta: T.resistencia, render: (t0) => <Winglet t0={t0} /> },
      { nombre: "Ahorro", desde: T.resistencia, hasta: T.paraEso, render: (t0) => <Ahorro t0={t0} /> },
      { nombre: "Cierre", desde: T.paraEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Vórtice de punta de ala", T.vortice, T.winglet, C.yellow],
      ["Resistencia inducida", T.resistencia, T.paraEso, C.white],
    ]}
    tics={[0.6, T.vortice, T.winglet, T.cinco]}
  />
);
