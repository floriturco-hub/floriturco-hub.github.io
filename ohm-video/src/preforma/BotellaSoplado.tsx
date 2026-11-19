import narracion from "../../guion/preforma/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Calor,
  Cierre,
  Gancho,
  Molde,
  Moleculas,
  Rosca,
  T,
} from "./Escenas";

export const DURACION_PREFORMA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const BotellaSoplado: React.FC = () => (
  <Short
    carpeta="preforma"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.botella, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.botella, hasta: T.llama, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Calor", desde: T.llama, hasta: T.molde, render: (t0) => <Calor t0={t0} /> },
      { nombre: "Molde", desde: T.molde, hasta: T.moleculas, render: (t0) => <Molde t0={t0} /> },
      { nombre: "Moléculas", desde: T.moleculas, hasta: T.rosca, render: (t0) => <Moleculas t0={t0} /> },
      { nombre: "Rosca", desde: T.rosca, hasta: T.asi, render: (t0) => <Rosca t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Estirado-soplado", T.varilla, T.moleculas, C.yellow],
      ["Orientación molecular", T.alinean, T.rosca, C.white],
    ]}
    tics={[0.6, T.globo, T.alinean]}
  />
);
