import narracion from "../../guion/estilografica/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Avion,
  Bucle,
  Burbuja,
  Cierre,
  Fibras,
  Gancho,
  Ranura,
  Tension,
  T,
} from "./Escenas";

export const DURACION_ESTILOGRAFICA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const PlumaFuente: React.FC = () => (
  <Short
    carpeta="estilografica"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.tiene, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.tiene, hasta: T.punta, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Ranura", desde: T.punta, hasta: T.pero, render: (t0) => <Ranura t0={t0} /> },
      { nombre: "Tensión", desde: T.pero, hasta: T.tocar, render: (t0) => <Tension t0={t0} /> },
      { nombre: "Papel", desde: T.tocar, hasta: T.cada, render: (t0) => <Fibras t0={t0} /> },
      { nombre: "Burbuja", desde: T.cada, hasta: T.avion, render: (t0) => <Burbuja t0={t0} /> },
      { nombre: "Avión", desde: T.avion, hasta: T.porEso, render: (t0) => <Avion t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Capilaridad", T.capilaridad, T.pero, C.cyan],
      ["Tensión superficial", T.superficial, T.tocar, C.cyan],
      ["Equilibrio de presiones", T.burbuja, T.avion, C.white],
    ]}
    tics={[0.7, T.tocar, T.gotea]}
  />
);
