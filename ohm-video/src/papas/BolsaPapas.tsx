import narracion from "../../guion/papas/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Capas,
  Cierre,
  Gancho,
  Nitrogeno,
  Pandeo,
  T,
} from "./Escenas";

export const DURACION_PAPAS_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const BolsaPapas: React.FC = () => (
  <Short
    carpeta="papas"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.intentas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.intentas, hasta: T.bolsa, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Capas", desde: T.bolsa, hasta: T.rigida, render: (t0) => <Capas t0={t0} /> },
      { nombre: "Pandeo", desde: T.rigida, hasta: T.silencio, render: (t0) => <Pandeo t0={t0} /> },
      { nombre: "Nitrógeno", desde: T.silencio, hasta: T.porEso, render: (t0) => <Nitrogeno t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Pandeo de láminas rígidas", T.pandea, T.silencio, C.yellow],
      ["Atmósfera de nitrógeno", T.nitrogeno, T.porEso, C.white],
    ]}
    tics={[0.6, T.chasquido, T.nitrogeno]}
  />
);
