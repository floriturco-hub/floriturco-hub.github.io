import narracion from "../../guion/huellacel/narracion.json";
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
  Condensadores,
  Crestas,
  Foto,
  Gancho,
  Mapa,
  Minucias,
  Toca,
  T,
} from "./Escenas";

export const DURACION_HUELLA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const HuellaCelular: React.FC = () => (
  <Short
    carpeta="huellacel"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.lo, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.lo, hasta: T.tuHuella, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Crestas", desde: T.tuHuella, hasta: T.muchos, render: (t0) => <Crestas t0={t0} /> },
      { nombre: "Condensadores", desde: T.muchos, hasta: T.las, render: (t0) => <Condensadores t0={t0} /> },
      { nombre: "Toca", desde: T.las, hasta: T.asi, render: (t0) => <Toca t0={t0} /> },
      { nombre: "Mapa", desde: T.asi, hasta: T.luego, render: (t0) => <Mapa t0={t0} /> },
      { nombre: "Minucias", desde: T.luego, hasta: T.una, render: (t0) => <Minucias t0={t0} /> },
      { nombre: "Foto", desde: T.una, hasta: T.porEso, render: (t0) => <Foto t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Sensor capacitivo", T.rejilla, T.las, C.white],
      ["Minucias", T.cortan, T.una, C.yellow],
    ]}
    tics={[0.62, T.crestas, T.condensadores, T.carga, T.compara + 1, T.plana]}
  />
);
