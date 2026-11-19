import narracion from "../../guion/stepper/narracion.json";
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
  Contar,
  Gancho,
  Interior,
  Pasos,
  Tornillo,
  T,
} from "./Escenas";

export const DURACION_STEPPER_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const MotorPasos: React.FC = () => (
  <Short
    carpeta="stepper"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.impresora, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.impresora, hasta: T.motor, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Motor de pasos", desde: T.motor, hasta: T.lugar, render: (t0) => <Interior t0={t0} /> },
      { nombre: "Pasos", desde: T.lugar, hasta: T.doscientos, render: (t0) => <Pasos t0={t0} /> },
      { nombre: "Tornillo", desde: T.doscientos, hasta: T.pulso, render: (t0) => <Tornillo t0={t0} /> },
      { nombre: "Contar", desde: T.pulso, hasta: T.asi, render: (t0) => <Contar t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Motor paso a paso", T.motor, T.lugar, C.white],
      ["Lazo abierto", T.contarlos, T.asi, C.cyan],
    ]}
    tics={[0.7, T.exacto, T.contarlos]}
  />
);
