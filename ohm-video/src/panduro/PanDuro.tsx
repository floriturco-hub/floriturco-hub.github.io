import narracion from "../../guion/panduro/narracion.json";
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
  Cristales,
  Frio,
  Gancho,
  Horno,
  Revivir,
  T,
} from "./Escenas";

export const DURACION_PANDURO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const PanDuro: React.FC = () => (
  <Short
    carpeta="panduro"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.hecho, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.hecho, hasta: T.almidon, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Horno", desde: T.almidon, hasta: T.enfriarse, render: (t0) => <Horno t0={t0} /> },
      { nombre: "Cristales", desde: T.enfriarse, hasta: T.refrigerador, render: (t0) => <Cristales t0={t0} /> },
      { nombre: "Frío", desde: T.refrigerador, hasta: T.revivirlo, render: (t0) => <Frio t0={t0} /> },
      { nombre: "Revivir", desde: T.revivirlo, hasta: T.porEso, render: (t0) => <Revivir t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Gelatinización del almidón", T.horno, T.enfriarse, C.white],
      ["Retrogradación", T.retrogradacion, T.refrigerador, C.yellow],
    ]}
    tics={[0.6, T.retrogradacion, T.calor]}
  />
);
