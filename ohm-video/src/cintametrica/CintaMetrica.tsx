import narracion from "../../guion/cintametrica/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Biestable,
  Bucle,
  Canaleta,
  Cierre,
  Gancho,
  Pandeo,
  T,
} from "./Escenas";

export const DURACION_CINTA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const CintaMetrica: React.FC = () => (
  <Short
    carpeta="cintametrica"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.sacas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.sacas, hasta: T.plana, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Canaleta", desde: T.plana, hasta: T.fuerza, render: (t0) => <Canaleta t0={t0} /> },
      { nombre: "Pandeo", desde: T.fuerza, hasta: T.estados, render: (t0) => <Pandeo t0={t0} /> },
      { nombre: "Biestable", desde: T.estados, hasta: T.porEso, render: (t0) => <Biestable t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Curvatura de Gauss", T.direcciones, T.fuerza, C.yellow],
      ["Biestabilidad", T.estados, T.porEso, C.white],
    ]}
    tics={[0.6, T.clac, T.aplana]}
  />
);
