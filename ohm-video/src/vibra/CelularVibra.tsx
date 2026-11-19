import narracion from "../../guion/vibra/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Antiguo,
  Bucle,
  Cierre,
  Clic,
  Gancho,
  Lineal,
  T,
} from "./Escenas";

export const DURACION_VIBRA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const CelularVibra: React.FC = () => (
  <Short
    carpeta="vibra"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.cuando, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.cuando, hasta: T.antiguos, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Motor antiguo", desde: T.antiguos, hasta: T.modernos, render: (t0) => <Antiguo t0={t0} /> },
      { nombre: "Motor lineal", desde: T.modernos, hasta: T.frenar, render: (t0) => <Lineal t0={t0} /> },
      { nombre: "Clic", desde: T.frenar, hasta: T.eso, render: (t0) => <Clic t0={t0} /> },
      { nombre: "Cierre", desde: T.eso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Motor ERM", T.pesa, T.modernos, C.yellow],
      ["Actuador lineal (LRA)", T.lineal, T.frenar, C.cyan],
      ["Respuesta háptica", T.golpecitos, T.eso, C.white],
    ]}
    tics={[0.7, T.tiembla, T.clic]}
  />
);
