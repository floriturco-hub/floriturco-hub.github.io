import narracion from "../../guion/refresco/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Abrir,
  Bucle,
  Cierre,
  Esperar,
  Estudio,
  Gancho,
  Gas,
  Idea,
  T,
} from "./Escenas";

export const DURACION_REFRESCO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const LataAgitada: React.FC = () => (
  <Short
    carpeta="refresco"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.agitas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.agitas, hasta: T.refresco, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Gas", desde: T.refresco, hasta: T.abrir, render: (t0) => <Gas t0={t0} /> },
      { nombre: "Abrir", desde: T.abrir, hasta: T.idea, render: (t0) => <Abrir t0={t0} /> },
      { nombre: "Idea", desde: T.idea, hasta: T.pero, render: (t0) => <Idea t0={t0} /> },
      { nombre: "Estudio", desde: T.pero, hasta: T.esperar, render: (t0) => <Estudio t0={t0} /> },
      { nombre: "Esperar", desde: T.esperar, hasta: T.asi, render: (t0) => <Esperar t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["CO₂ disuelto", T.gas, T.abrir, C.white],
      ["Núcleos de burbuja", T.corre, T.idea, C.yellow],
      ["Mito desmentido", T.nada, T.esperar, C.red],
    ]}
    tics={[0.7, T.explota, T.empujan, T.nada]}
  />
);
