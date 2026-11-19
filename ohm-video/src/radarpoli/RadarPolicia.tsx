import narracion from "../../guion/radarpoli/narracion.json";
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
  Gancho,
  Laser,
  Radar,
  T,
} from "./Escenas";

export const DURACION_RADAR_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const RadarPolicia: React.FC = () => (
  <Short
    carpeta="radarpoli"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.policia, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.policia, hasta: T.radar, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Radar", desde: T.radar, hasta: T.laser, render: (t0) => <Radar t0={t0} /> },
      { nombre: "Láser", desde: T.laser, hasta: T.asi, render: (t0) => <Laser t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Efecto Doppler", T.doppler, T.laser, C.yellow],
      ["LiDAR: tiempo de vuelo", T.tardan, T.asi, C.cyan],
    ]}
    tics={[0.6, T.doppler, T.laser]}
  />
);
