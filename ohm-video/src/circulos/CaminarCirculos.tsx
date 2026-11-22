import narracion from "../../guion/circulos/narracion.json";
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
  Errores,
  Estudio,
  Gancho,
  Pierna,
  Referencias,
  Salva,
  T,
} from "./Escenas";

export const DURACION_CIRCULOS_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const CaminarCirculos: React.FC = () => (
  <Short
    carpeta="circulos"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.en, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.en, hasta: T.al, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Referencias", desde: T.al, hasta: T.sin, render: (t0) => <Referencias t0={t0} /> },
      { nombre: "Errores", desde: T.sin, hasta: T.estudio, render: (t0) => <Errores t0={t0} /> },
      { nombre: "Estudio", desde: T.estudio, hasta: T.y, render: (t0) => <Estudio t0={t0} /> },
      { nombre: "Pierna", desde: T.y, hasta: T.lo, render: (t0) => <Pierna t0={t0} /> },
      { nombre: "Punto fijo", desde: T.lo, hasta: T.porEso, render: (t0) => <Salva t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Errores acumulados", T.sumando, T.estudio, C.white],
      ["Souman et al., 2009", T.vueltas, T.y, C.grey],
      ["Navegación", T.brujula, T.porEso, C.yellow],
    ]}
    tics={[0.74, T.no, T.horizonte, T.sumando, T.veinte, T.punto]}
  />
);
