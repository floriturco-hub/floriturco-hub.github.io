import narracion from "../../guion/cabezaexplosiva/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Apagado,
  Bucle,
  Cierre,
  Descarga,
  Gancho,
  Inofensivo,
  Nombre,
  Ruido,
  T,
} from "./Escenas";

export const DURACION_CABEZAEXPLOSIVA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const CabezaExplosiva: React.FC = () => (
  <Short
    carpeta="cabezaexplosiva"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.dormido, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.dormido, hasta: T.llama, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Nombre", desde: T.llama, hasta: T.dormirte, render: (t0) => <Nombre t0={t0} /> },
      { nombre: "Apagado", desde: T.dormirte, hasta: T.cree, render: (t0) => <Apagado t0={t0} /> },
      { nombre: "Descarga", desde: T.cree, hasta: T.interpreta, render: (t0) => <Descarga t0={t0} /> },
      { nombre: "Ruido", desde: T.interpreta, hasta: T.comun, render: (t0) => <Ruido t0={t0} /> },
      { nombre: "Inofensivo", desde: T.comun, hasta: T.eso, render: (t0) => <Inofensivo t0={t0} /> },
      { nombre: "Cierre", desde: T.eso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Síndrome de la cabeza explosiva", T.sindrome, T.dormirte, C.yellow],
      ["Descarga de neuronas auditivas", T.dispara, T.interpreta, C.yellow],
      ["Inofensivo", T.inofensivo, T.eso, C.white],
    ]}
    tics={[0.05, T.explosion, T.dispara, T.inofensivo]}
  />
);
