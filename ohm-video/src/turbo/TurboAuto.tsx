import narracion from "../../guion/turbo/narracion.json";
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
  Compresor,
  Gancho,
  Lag,
  Potencia,
  Turbina,
  T,
} from "./Escenas";

export const DURACION_TURBO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const TurboAuto: React.FC = () => (
  <Short
    carpeta="turbo"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.potencia, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.potencia, hasta: T.gases, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Turbina", desde: T.gases, hasta: T.eje, render: (t0) => <Turbina t0={t0} /> },
      { nombre: "Compresor", desde: T.eje, hasta: T.oxigeno, render: (t0) => <Compresor t0={t0} /> },
      { nombre: "Potencia", desde: T.oxigeno, hasta: T.aceleras, render: (t0) => <Potencia t0={t0} /> },
      { nombre: "Lag", desde: T.aceleras, hasta: T.asi, render: (t0) => <Lag t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Turbocompresor", T.turbina, T.eje, C.yellow],
    ]}
    tics={[0.6, T.turbina, T.lag]}
  />
);
