import narracion from "../../guion/chorro/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Acelera,
  Bucle,
  Cierre,
  Gancho,
  Impresora,
  Nombre,
  Ondula,
  Tension,
  T,
} from "./Escenas";

export const DURACION_CHORRO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const ChorroGotas: React.FC = () => (
  <Short
    carpeta="chorro"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.abres, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.abres, hasta: T.acelera, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Acelera", desde: T.acelera, hasta: T.tension, render: (t0) => <Acelera t0={t0} /> },
      { nombre: "Tensión", desde: T.tension, hasta: T.largo, render: (t0) => <Tension t0={t0} /> },
      { nombre: "Ondulación", desde: T.largo, hasta: T.llama, render: (t0) => <Ondula t0={t0} /> },
      { nombre: "Plateau-Rayleigh", desde: T.llama, hasta: T.impresoras, render: (t0) => <Nombre t0={t0} /> },
      { nombre: "Impresora", desde: T.impresoras, hasta: T.porEso, render: (t0) => <Impresora t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Tensión superficial", T.tension, T.largo, C.yellow],
      ["Gotas por inestabilidad", T.estrangularlo, T.impresoras, C.white],
    ]}
    tics={[0.6, T.tension, T.inestabilidad]}
  />
);
