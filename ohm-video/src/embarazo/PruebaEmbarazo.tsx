import narracion from "../../guion/embarazo/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Avanza,
  Bucle,
  Cierre,
  Control,
  Gancho,
  Hcg,
  LineaT,
  Oro,
  T,
} from "./Escenas";

export const DURACION_EMBARAZO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const PruebaEmbarazo: React.FC = () => (
  <Short
    carpeta="embarazo"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.solo, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.solo, hasta: T.durante, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Hormona", desde: T.durante, hasta: T.la, render: (t0) => <Hcg t0={t0} /> },
      { nombre: "Capilaridad", desde: T.la, hasta: T.primero, render: (t0) => <Avanza t0={t0} /> },
      { nombre: "Oro", desde: T.primero, hasta: T.mas, render: (t0) => <Oro t0={t0} /> },
      { nombre: "Raya T", desde: T.mas, hasta: T.un, render: (t0) => <LineaT t0={t0} /> },
      { nombre: "Raya C", desde: T.un, hasta: T.porEso, render: (t0) => <Control t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Inmunocromatografía", T.servilleta, T.primero, C.white],
      ["Oro coloidal", T.oro, T.mas, C.red],
      ["Control de calidad", T.funciono, T.porEso, C.yellow],
    ]}
    tics={[1.16, T.hcg, T.pegan, T.prueba, T.esa, T.funciono]}
  />
);
