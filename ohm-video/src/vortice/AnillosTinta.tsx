import narracion from "../../guion/vortice/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Cascada,
  Cierre,
  Crece,
  Dona,
  Frena,
  Gancho,
  Rompe,
  T,
} from "./Escenas";

export const DURACION_VORTICE_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const AnillosTinta: React.FC = () => (
  <Short
    carpeta="vortice"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.deja, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.deja, hasta: T.al, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Frena", desde: T.al, hasta: T.asi, render: (t0) => <Frena t0={t0} /> },
      { nombre: "Anillo", desde: T.asi, hasta: T.alBajar, render: (t0) => <Dona t0={t0} /> },
      { nombre: "Crece", desde: T.alBajar, hasta: T.pequenas, render: (t0) => <Crece t0={t0} /> },
      { nombre: "Se rompe", desde: T.pequenas, hasta: T.y, render: (t0) => <Rompe t0={t0} /> },
      { nombre: "Cascada", desde: T.y, hasta: T.porEso, render: (t0) => <Cascada t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Anillo de vórtice", T.vortice, T.alBajar, C.white],
      ["Inestabilidad", T.rompe, T.y, C.yellow],
    ]}
    tics={[0.66, T.enrolla, T.vortice, T.rompe, T.dividirse, T.cascada]}
  />
);
