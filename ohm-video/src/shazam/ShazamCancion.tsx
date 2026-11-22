import narracion from "../../guion/shazam/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Busqueda,
  Cierre,
  Gancho,
  Huella,
  Mapa,
  Picos,
  Ruido,
  T,
} from "./Escenas";

export const DURACION_SHAZAM_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const ShazamCancion: React.FC = () => (
  <Short
    carpeta="shazam"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.bar, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.bar, hasta: T.mapa, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Mapa", desde: T.mapa, hasta: T.fuertes, render: (t0) => <Mapa t0={t0} /> },
      { nombre: "Picos", desde: T.fuertes, hasta: T.parejas, render: (t0) => <Picos t0={t0} /> },
      { nombre: "Huella", desde: T.parejas, hasta: T.compara, render: (t0) => <Huella t0={t0} /> },
      { nombre: "Busqueda", desde: T.compara, hasta: T.ruido2, render: (t0) => <Busqueda t0={t0} /> },
      { nombre: "Ruido", desde: T.ruido2, hasta: T.asi, render: (t0) => <Ruido t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Espectrograma", T.mapa, T.fuertes, C.cyan],
      ["Huella acústica", T.parejas, T.compara, C.yellow],
    ]}
    tics={[0.6, T.codigo, T.sobreviven]}
  />
);
