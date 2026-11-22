import narracion from "../../guion/proximidad/narracion.json";
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
  Limite,
  Pulsos,
  Sensor,
  Sucio,
  T,
} from "./Escenas";

export const DURACION_PROXIMIDAD_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const PantallaOreja: React.FC = () => (
  <Short
    carpeta="proximidad"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.llamas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.llamas, hasta: T.junto, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Sensor", desde: T.junto, hasta: T.dispara, render: (t0) => <Sensor t0={t0} /> },
      { nombre: "Pulsos", desde: T.dispara, hasta: T.limite, render: (t0) => <Pulsos t0={t0} /> },
      { nombre: "Límite", desde: T.limite, hasta: T.si, render: (t0) => <Limite t0={t0} /> },
      { nombre: "Sensor tapado", desde: T.si, hasta: T.asi, render: (t0) => <Sucio t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Sensor de proximidad", T.sensor, T.dispara, C.yellow],
      ["Reflexión infrarroja", T.rebota, T.limite, C.red],
      ["Umbral", T.limite, T.si, C.yellow],
    ]}
    tics={[0.7, T.mucha, T.negra]}
  />
);
