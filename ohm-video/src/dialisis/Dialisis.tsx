import narracion from "../../guion/dialisis/narracion.json";
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
  Contra,
  Filtro,
  Gancho,
  Poros,
  Vuelve,
  T,
} from "./Escenas";

export const DURACION_DIALISIS_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const Dialisis: React.FC = () => (
  <Short
    carpeta="dialisis"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.cuando, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.cuando, hasta: T.sale, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Filtro", desde: T.sale, hasta: T.paredes, render: (t0) => <Filtro t0={t0} /> },
      { nombre: "Poros", desde: T.paredes, hasta: T.fuera, render: (t0) => <Poros t0={t0} /> },
      { nombre: "Contracorriente", desde: T.fuera, hasta: T.limpia, render: (t0) => <Contra t0={t0} /> },
      { nombre: "Vuelve", desde: T.limpia, hasta: T.asi, render: (t0) => <Vuelve t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Hemodiálisis", T.maquina, T.sale, C.white],
      ["Membrana semipermeable", T.poros, T.fuera, C.cyan],
      ["Difusión a contracorriente", T.contrario, T.limpia, C.yellow],
    ]}
    tics={[0.7, T.mucho, T.quince]}
  />
);
