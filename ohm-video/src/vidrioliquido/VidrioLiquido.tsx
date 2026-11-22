import narracion from "../../guion/vidrioliquido/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Amorfo,
  Bucle,
  Cierre,
  Corona,
  Gancho,
  Romanas,
  T,
} from "./Escenas";

export const DURACION_VIDRIOLIQ_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const VidrioLiquido: React.FC = () => (
  <Short
    carpeta="vidrioliquido"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.dicen, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.dicen, hasta: T.amorfo, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Amorfo", desde: T.amorfo, hasta: T.gruesas, render: (t0) => <Amorfo t0={t0} /> },
      { nombre: "Corona", desde: T.gruesas, hasta: T.romanas, render: (t0) => <Corona t0={t0} /> },
      { nombre: "Romanas", desde: T.romanas, hasta: T.este, render: (t0) => <Romanas t0={t0} /> },
      { nombre: "Cierre", desde: T.este, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Sólido amorfo", T.amorfo, T.universo, C.yellow],
    ]}
    tics={[0.6, T.amorfo, T.romanas]}
  />
);
