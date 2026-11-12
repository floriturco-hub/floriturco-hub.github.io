import narracion from "../../guion/carbon/narracion.json";
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
  Estomago,
  Gancho,
  Limite,
  Poros,
  Sangre,
  Superficie,
  T,
} from "./Escenas";

export const DURACION_CARBON_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const CarbonActivado: React.FC = () => (
  <Short
    carpeta="carbon"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho: vaso", desde: 0, hasta: T.suena, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.suena, hasta: T.noAsar, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Poros", desde: T.noAsar, hasta: T.cucharada, render: (t0) => <Poros t0={t0} /> },
      { nombre: "Superficie", desde: T.cucharada, hasta: T.estomago, render: (t0) => <Superficie t0={t0} /> },
      { nombre: "Estómago", desde: T.estomago, hasta: T.asi, render: (t0) => <Estomago t0={t0} /> },
      { nombre: "Sangre", desde: T.asi, hasta: T.pero, render: (t0) => <Sangre t0={t0} /> },
      { nombre: "Límite", desde: T.pero, hasta: T.porEso, render: (t0) => <Limite t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Carbón activado", T.vapor, T.cucharada, C.white],
      ["Adsorción", T.pegado, T.asi, C.yellow],
      ["Solo en el hospital", T.solo, T.ademas, C.red],
    ]}
    tics={[1.06, T.poros, T.campo, T.pegado, T.sangre, T.escapan]}
  />
);
