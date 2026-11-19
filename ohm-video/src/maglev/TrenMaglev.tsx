import narracion from "../../guion/maglev/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Avance,
  Bucle,
  Cierre,
  Despega,
  Gancho,
  Induce,
  Sensores,
  T,
} from "./Escenas";

export const DURACION_MAGLEV_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const TrenMaglev: React.FC = () => (
  <Short
    carpeta="maglev"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.imanes, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.imanes, hasta: T.japones, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Inducción", desde: T.japones, hasta: T.poca, render: (t0) => <Induce t0={t0} /> },
      { nombre: "Despegue", desde: T.poca, hasta: T.otros, render: (t0) => <Despega t0={t0} /> },
      { nombre: "Sensores", desde: T.otros, hasta: T.campo, render: (t0) => <Sensores t0={t0} /> },
      { nombre: "Propulsión", desde: T.campo, hasta: T.asi, render: (t0) => <Avance t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Teorema de Earnshaw", T.estable, T.japones, C.red],
      ["Levitación electrodinámica", T.induce, T.otros, C.yellow],
      ["Motor lineal", T.campo, T.asi, C.cyan],
    ]}
    tics={[0.7, T.empujan, T.adelante]}
  />
);
