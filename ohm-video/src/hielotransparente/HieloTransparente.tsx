import narracion from "../../guion/hielotransparente/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Casa,
  Cierre,
  Congela,
  Direccion,
  Gancho,
  T,
} from "./Escenas";

export const DURACION_HIELOTRANSP_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const HieloTransparente: React.FC = () => (
  <Short
    carpeta="hielotransparente"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.blancos, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.blancos, hasta: T.aire, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Congela", desde: T.aire, hasta: T.maquinas, render: (t0) => <Congela t0={t0} /> },
      { nombre: "Direccion", desde: T.maquinas, hasta: T.hielera, render: (t0) => <Direccion t0={t0} /> },
      { nombre: "Casa", desde: T.hielera, hasta: T.porEso, render: (t0) => <Casa t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Burbujas atrapadas", T.empuja, T.maquinas, C.orange],
      ["Congelación direccional", T.direccion, T.hielera, C.yellow],
    ]}
    tics={[0.6, T.burbujitas, T.escapar]}
  />
);
