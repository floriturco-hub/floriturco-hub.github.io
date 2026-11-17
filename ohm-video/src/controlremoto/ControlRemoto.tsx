import narracion from "../../guion/controlremoto/narracion.json";
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
  Codigo,
  Gancho,
  Infrarrojo,
  Portadora,
  Sensor,
  T,
} from "./Escenas";

export const DURACION_CONTROL_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const ControlRemoto: React.FC = () => (
  <Short
    carpeta="controlremoto"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.aprietas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.aprietas, hasta: T.punta, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Infrarrojo", desde: T.punta, hasta: T.parpadea, render: (t0) => <Infrarrojo t0={t0} /> },
      { nombre: "Código", desde: T.parpadea, hasta: T.vibra, render: (t0) => <Codigo t0={t0} /> },
      { nombre: "38 kHz", desde: T.vibra, hasta: T.sensor, render: (t0) => <Portadora t0={t0} /> },
      { nombre: "Sensor", desde: T.sensor, hasta: T.asi, render: (t0) => <Sensor t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Luz infrarroja", T.infrarrojo, T.parpadea, C.white],
      ["Señal modulada a 38 kHz", T.vibra, T.sensor, C.yellow],
    ]}
    tics={[0.6, T.codigo, T.morada]}
  />
);
