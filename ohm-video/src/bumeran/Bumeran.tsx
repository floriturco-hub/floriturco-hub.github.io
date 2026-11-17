import narracion from "../../guion/bumeran/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Ala,
  Bucle,
  Cierre,
  Gancho,
  Lanzar,
  Precesion,
  Velocidad,
  T,
} from "./Escenas";

export const DURACION_BUMERAN_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const Bumeran: React.FC = () => (
  <Short
    carpeta="bumeran"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.lanzas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.lanzas, hasta: T.ala, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Ala", desde: T.ala, hasta: T.gira, render: (t0) => <Ala t0={t0} /> },
      { nombre: "Velocidad", desde: T.gira, hasta: T.velocidad, render: (t0) => <Velocidad t0={t0} /> },
      { nombre: "Precesión", desde: T.velocidad, hasta: T.vertical, render: (t0) => <Precesion t0={t0} /> },
      { nombre: "Cómo lanzarlo", desde: T.vertical, hasta: T.asi, render: (t0) => <Lanzar t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Sustentación", T.sustentacion, T.gira, C.white],
      ["Precesión giroscópica", T.precesion, T.vertical, C.yellow],
    ]}
    tics={[0.6, T.sustentacion, T.precesion]}
  />
);
