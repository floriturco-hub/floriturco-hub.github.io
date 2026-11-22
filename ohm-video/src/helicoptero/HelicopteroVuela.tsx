import narracion from "../../guion/helicoptero/narracion.json";
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
  Cola,
  Disco,
  Empuje,
  Gancho,
  Palas,
  T,
} from "./Escenas";

export const DURACION_HELICOPTERO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const HelicopteroVuela: React.FC = () => (
  <Short
    carpeta="helicoptero"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.su, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.su, hasta: T.cada, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Palas", desde: T.cada, hasta: T.si, render: (t0) => <Palas t0={t0} /> },
      { nombre: "Disco", desde: T.si, hasta: T.el, render: (t0) => <Disco t0={t0} /> },
      { nombre: "Empuje", desde: T.el, hasta: T.y, render: (t0) => <Empuje t0={t0} /> },
      { nombre: "Cola", desde: T.y, hasta: T.porEso, render: (t0) => <Cola t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Paso de las palas", T.angulo, T.si, C.white],
      ["Control cíclico", T.inclina, T.el, C.yellow],
      ["Rotor de cola: antipar", T.derecho, T.porEso, C.cyan],
    ]}
    tics={[0.74, T.plato, T.inclina, T.adelante, T.gira, T.derecho]}
  />
);
