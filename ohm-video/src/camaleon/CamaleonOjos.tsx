import narracion from "../../guion/camaleon/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Cerebro,
  Cierre,
  Gancho,
  Insecto,
  Torreta,
  T,
} from "./Escenas";

export const DURACION_CAMALEON_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const CamaleonOjos: React.FC = () => (
  <Short
    carpeta="camaleon"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.giran, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.giran, hasta: T.torreta, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Torreta", desde: T.torreta, hasta: T.cerebro, render: (t0) => <Torreta t0={t0} /> },
      { nombre: "Atención", desde: T.cerebro, hasta: T.pero, render: (t0) => <Cerebro t0={t0} /> },
      { nombre: "Caza", desde: T.pero, hasta: T.asi, render: (t0) => <Insecto t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Visión independiente", T.torreta, T.cerebro, C.yellow],
      ["Atención alterna", T.alternando, T.pero, C.cyan],
    ]}
    tics={[0.7, T.dispara]}
  />
);
