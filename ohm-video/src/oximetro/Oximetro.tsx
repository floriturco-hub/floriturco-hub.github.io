import narracion from "../../guion/oximetro/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Absorbe,
  Bucle,
  Cierre,
  Esmalte,
  Gancho,
  Luces,
  Pulso,
  T,
} from "./Escenas";

export const DURACION_OXIMETRO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const Oximetro: React.FC = () => (
  <Short
    carpeta="oximetro"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.te, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.te, hasta: T.lado, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Luces", desde: T.lado, hasta: T.hemoglobina, render: (t0) => <Luces t0={t0} /> },
      { nombre: "Absorción", desde: T.hemoglobina, hasta: T.latido, render: (t0) => <Absorbe t0={t0} /> },
      { nombre: "Pulso", desde: T.latido, hasta: T.esmalte, render: (t0) => <Pulso t0={t0} /> },
      { nombre: "Esmalte", desde: T.esmalte, hasta: T.asi, render: (t0) => <Esmalte t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Pulsioximetría", T.luces, T.hemoglobina, C.white],
      ["Espectro de la hemoglobina", T.absorbe, T.latido, C.red],
      ["Saturación de oxígeno", T.calcula, T.esmalte, C.cyan],
    ]}
    tics={[0.7, T.calcula, T.enganarlo]}
  />
);
