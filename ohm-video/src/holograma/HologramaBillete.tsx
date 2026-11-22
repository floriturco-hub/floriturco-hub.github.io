import narracion from "../../guion/holograma/narracion.json";
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
  Copia,
  Difraccion,
  Gancho,
  Ojos,
  Surcos,
  Zonas,
  T,
} from "./Escenas";

export const DURACION_HOLOGRAMA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const HologramaBillete: React.FC = () => (
  <Short
    carpeta="holograma"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.holograma, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.holograma, hasta: T.superficie, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Surcos", desde: T.superficie, hasta: T.cuando, render: (t0) => <Surcos t0={t0} /> },
      { nombre: "Difracción", desde: T.cuando, hasta: T.cambian, render: (t0) => <Difraccion t0={t0} /> },
      { nombre: "Zonas", desde: T.cambian, hasta: T.ojo, render: (t0) => <Zonas t0={t0} /> },
      { nombre: "Visión 3D", desde: T.ojo, hasta: T.copiarlos, render: (t0) => <Ojos t0={t0} /> },
      { nombre: "Copia", desde: T.copiarlos, hasta: T.porEso, render: (t0) => <Copia t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Red de difracción", T.desvia, T.cambian, C.white],
      ["Visión estereoscópica", T.ojo, T.copiarlos, C.yellow],
    ]}
    tics={[0.7, T.colores, T.profundidad]}
  />
);
