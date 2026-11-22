import narracion from "../../guion/fotocrom/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Absorben,
  Auto,
  Bucle,
  Cierre,
  Dobladas,
  Gancho,
  Interior,
  Moleculas,
  Ultravioleta,
  T,
} from "./Escenas";

export const DURACION_FOTOCROM_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const LentesTransitions: React.FC = () => (
  <Short
    carpeta="fotocrom"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.sales, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.sales, hasta: T.el, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Moléculas", desde: T.el, hasta: T.normal, render: (t0) => <Moleculas t0={t0} /> },
      { nombre: "Dobladas", desde: T.normal, hasta: T.pero, render: (t0) => <Dobladas t0={t0} /> },
      { nombre: "Ultravioleta", desde: T.pero, hasta: T.abiertas, render: (t0) => <Ultravioleta t0={t0} /> },
      { nombre: "Absorben", desde: T.abiertas, hasta: T.bajo, render: (t0) => <Absorben t0={t0} /> },
      { nombre: "Interior", desde: T.bajo, hasta: T.y, render: (t0) => <Interior t0={t0} /> },
      { nombre: "Auto", desde: T.y, hasta: T.porEso, render: (t0) => <Auto t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Moléculas fotocrómicas", T.capa, T.normal, C.white],
      ["La luz UV las activa", T.abren, T.abiertas, C.yellow],
      ["Reversible", T.aclara, T.y, C.cyan],
    ]}
    tics={[1.06, T.moleculas, T.abren, T.oscurece, T.aclara, T.parabrisas]}
  />
);
