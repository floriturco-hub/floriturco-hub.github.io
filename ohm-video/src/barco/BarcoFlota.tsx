import narracion from "../../guion/barco/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Aguja,
  Agujero,
  Aparta,
  Bucle,
  Cierre,
  Gancho,
  Hueco,
  T,
} from "./Escenas";

export const DURACION_BARCO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const BarcoFlota: React.FC = () => (
  <Short
    carpeta="barco"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.pesa, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.pesa, hasta: T.todo, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Empuje", desde: T.todo, hasta: T.la, render: (t0) => <Aparta t0={t0} /> },
      { nombre: "Aguja", desde: T.la, hasta: T.el, render: (t0) => <Aguja t0={t0} /> },
      { nombre: "Barco hueco", desde: T.el, hasta: T.si, render: (t0) => <Hueco t0={t0} /> },
      { nombre: "Agujero", desde: T.si, hasta: T.porEso, render: (t0) => <Agujero t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Principio de Arquímedes", T.empuja, T.la, C.white],
      ["Flotabilidad", T.flota, T.si, C.yellow],
    ]}
    tics={[0.84, T.aguja + 1, T.empuja, T.hunde, T.flota, T.hunde2]}
  />
);
