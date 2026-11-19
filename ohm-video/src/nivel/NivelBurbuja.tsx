import narracion from "../../guion/nivel/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Cierre,
  Curva,
  Gancho,
  Precision,
  Recto,
  Sube,
  T,
} from "./Escenas";

export const DURACION_NIVEL_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const NivelBurbuja: React.FC = () => (
  <Short
    carpeta="nivel"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.tubito, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.tubito, hasta: T.burbuja, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Burbuja", desde: T.burbuja, hasta: T.si, render: (t0) => <Sube t0={t0} /> },
      { nombre: "Tubo recto", desde: T.si, hasta: T.con, render: (t0) => <Recto t0={t0} /> },
      { nombre: "Curva", desde: T.con, hasta: T.cuanto, render: (t0) => <Curva t0={t0} /> },
      { nombre: "Precisión", desde: T.cuanto, hasta: T.porEso, render: (t0) => <Precision t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["La burbuja busca el punto más alto", T.sube, T.si, C.white],
      ["Radio de curvatura = precisión", T.preciso, T.porEso, C.yellow],
    ]}
    tics={[0.6, T.centro, T.preciso]}
  />
);
