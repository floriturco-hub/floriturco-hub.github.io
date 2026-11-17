import narracion from "../../guion/lectorqr/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Camara,
  Cierre,
  Esquinas,
  Gancho,
  Laser,
  Respaldo,
  T,
} from "./Escenas";

export const DURACION_LECTORQR_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const LectorQr: React.FC = () => (
  <Short
    carpeta="lectorqr"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.acercas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.acercas, hasta: T.lectores, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Láser", desde: T.lectores, hasta: T.qr, render: (t0) => <Laser t0={t0} /> },
      { nombre: "Cámara", desde: T.qr, hasta: T.programa, render: (t0) => <Camara t0={t0} /> },
      { nombre: "Esquinas", desde: T.programa, hasta: T.respaldo, render: (t0) => <Esquinas t0={t0} /> },
      { nombre: "Respaldo", desde: T.respaldo, hasta: T.asi, render: (t0) => <Respaldo t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Sensor de imagen CMOS", T.sensor, T.programa, C.yellow],
      ["Corrección de errores", T.treinta, T.asi, C.white],
    ]}
    tics={[0.6, T.camara, T.reconstruye]}
  />
);
