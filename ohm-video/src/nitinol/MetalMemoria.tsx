import narracion from "../../guion/nitinol/narracion.json";
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
  Frio,
  Gancho,
  Golpe,
  Medicos,
  Nitinol,
  T,
} from "./Escenas";

export const DURACION_NITINOL_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const MetalMemoria: React.FC = () => (
  <Short
    carpeta="nitinol"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.lo, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.lo, hasta: T.es, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Nitinol", desde: T.es, hasta: T.frio, render: (t0) => <Nitinol t0={t0} /> },
      { nombre: "En frío", desde: T.frio, hasta: T.calentarlo, render: (t0) => <Frio t0={t0} /> },
      { nombre: "En caliente", desde: T.calentarlo, hasta: T.porEso, render: (t0) => <Calor t0={t0} /> },
      { nombre: "De golpe", desde: T.porEso, hasta: T.medicos, render: (t0) => <Golpe t0={t0} /> },
      { nombre: "Stent", desde: T.medicos, hasta: T.asi, render: (t0) => <Medicos t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Martensita", T.flexible, T.calentarlo, C.cyan],
      ["Austenita", T.saltan, T.porEso, C.orange],
      ["Memoria de forma", T.golpe, T.medicos, C.white],
    ]}
    tics={[0.7, T.endereza, T.saltan, T.golpe, T.abren]}
  />
);
