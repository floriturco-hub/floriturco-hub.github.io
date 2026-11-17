import narracion from "../../guion/gatocae/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Altura,
  Bucle,
  Cierre,
  Fase1,
  Fase2,
  Gancho,
  Oido,
  T,
} from "./Escenas";

export const DURACION_GATO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const GatoCae: React.FC = () => (
  <Short
    carpeta="gatocae"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.sueltas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.sueltas, hasta: T.oido, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Oído interno", desde: T.oido, hasta: T.dobla, render: (t0) => <Oido t0={t0} /> },
      { nombre: "Fase 1", desde: T.dobla, hasta: T.invierte, render: (t0) => <Fase1 t0={t0} /> },
      { nombre: "Fase 2", desde: T.invierte, hasta: T.compensa, render: (t0) => <Fase2 t0={t0} /> },
      { nombre: "Altura", desde: T.compensa, hasta: T.asi, render: (t0) => <Altura t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Reflejo de enderezamiento", T.oido, T.dobla, C.white],
      ["Conservación del momento angular", T.dobla, T.compensa, C.yellow],
    ]}
    tics={[0.6, T.invierte, T.centimetros]}
  />
);
