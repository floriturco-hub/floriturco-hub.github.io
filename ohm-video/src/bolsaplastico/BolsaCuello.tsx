import narracion from "../../guion/bolsaplastico/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Alineadas,
  Bucle,
  Cierre,
  Cuello,
  Enredo,
  Fabricas,
  Gancho,
  T,
} from "./Escenas";

export const DURACION_BOLSA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const BolsaCuello: React.FC = () => (
  <Short
    carpeta="bolsaplastico"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.estiras, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.estiras, hasta: T.cadenas, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Enredo", desde: T.cadenas, hasta: T.debil, render: (t0) => <Enredo t0={t0} /> },
      { nombre: "Cuello", desde: T.debil, hasta: T.jalas, render: (t0) => <Cuello t0={t0} /> },
      { nombre: "Alineadas", desde: T.jalas, hasta: T.fabricas2, render: (t0) => <Alineadas t0={t0} /> },
      { nombre: "Fabricas", desde: T.fabricas2, hasta: T.porEso, render: (t0) => <Fabricas t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Estricción (cuello)", T.cuello, T.jalas, C.cyan],
      ["Endurecimiento por deformación", T.durisima2, T.fabricas2, C.yellow],
    ]}
    tics={[0.6, T.cuello, T.durisima2]}
  />
);
