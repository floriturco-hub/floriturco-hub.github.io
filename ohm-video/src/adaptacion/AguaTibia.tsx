import narracion from "../../guion/adaptacion/narracion.json";
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
  Experimento,
  Gancho,
  Piel,
  Sensores,
  T,
} from "./Escenas";

export const DURACION_ADAPTACION_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const AguaTibia: React.FC = () => (
  <Short
    carpeta="adaptacion"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.ducha, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.ducha, hasta: T.piel, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Sensores", desde: T.piel, hasta: T.temperatura, render: (t0) => <Sensores t0={t0} /> },
      { nombre: "Piel", desde: T.temperatura, hasta: T.experimento, render: (t0) => <Piel t0={t0} /> },
      { nombre: "Experimento", desde: T.experimento, hasta: T.porEso, render: (t0) => <Experimento t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Adaptación sensorial", T.adaptacion, T.temperatura, C.yellow],
    ]}
    tics={[0.6, T.adaptacion, T.tibia]}
  />
);
