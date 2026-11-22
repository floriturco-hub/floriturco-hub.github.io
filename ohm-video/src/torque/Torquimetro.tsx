import narracion from "../../guion/torque/narracion.json";
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
  Clic,
  Dentro,
  Gancho,
  Guardar,
  Perilla,
  T,
} from "./Escenas";

export const DURACION_TORQUE_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const Torquimetro: React.FC = () => (
  <Short
    carpeta="torque"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.aprietas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.aprietas, hasta: T.dentro, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Dentro", desde: T.dentro, hasta: T.girando, render: (t0) => <Dentro t0={t0} /> },
      { nombre: "Perilla", desde: T.girando, hasta: T.mientras, render: (t0) => <Perilla t0={t0} /> },
      { nombre: "Clic", desde: T.mientras, hasta: T.si, render: (t0) => <Clic t0={t0} /> },
      { nombre: "Guardar", desde: T.si, hasta: T.asi, render: (t0) => <Guardar t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Torque = fuerza × brazo", T.mientras, T.supera, C.orange],
      ["Mecanismo de disparo", T.desliza, T.si, C.yellow],
      ["Fatiga del resorte", T.cansa, T.asi, C.red],
    ]}
    tics={[0.7, T.clic, T.desliza, T.minimo]}
  />
);
