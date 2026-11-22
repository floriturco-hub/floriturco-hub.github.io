import narracion from "../../guion/calentador/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Calor,
  Cierre,
  Gancho,
  Recarga,
  Semilla,
  Sobreenfriado,
  T,
} from "./Escenas";

export const DURACION_CALENTADOR_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const CalentadorManos: React.FC = () => (
  <Short
    carpeta="calentador"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.doblas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.doblas, hasta: T.acetato, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Sobreenfriado", desde: T.acetato, hasta: T.semilla, render: (t0) => <Sobreenfriado t0={t0} /> },
      { nombre: "Semilla", desde: T.semilla, hasta: T.volverse, render: (t0) => <Semilla t0={t0} /> },
      { nombre: "Calor", desde: T.volverse, hasta: T.recargarla, render: (t0) => <Calor t0={t0} /> },
      { nombre: "Recarga", desde: T.recargarla, hasta: T.asi, render: (t0) => <Recarga t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Líquido sobreenfriado", T.sobreenfriado, T.semilla, C.cyan],
      ["Nucleación", T.primer, T.volverse, C.white],
      ["Calor latente", T.calor, T.recargarla, C.yellow],
    ]}
    tics={[0.6, T.doblar, T.grados]}
  />
);
