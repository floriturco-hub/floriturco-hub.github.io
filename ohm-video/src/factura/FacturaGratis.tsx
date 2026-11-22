import narracion from "../../guion/factura/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Balance,
  Bucle,
  Cierre,
  Gancho,
  Registro,
  Robo,
  Trampa,
  Vigilante,
  T,
} from "./Escenas";

export const DURACION_FACTURA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const FacturaGratis: React.FC = () => (
  <Short
    carpeta="factura"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.seguro, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.seguro, hasta: T.parece, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Trampa", desde: T.parece, hasta: T.si, render: (t0) => <Trampa t0={t0} /> },
      { nombre: "Robo", desde: T.si, hasta: T.con, render: (t0) => <Robo t0={t0} /> },
      { nombre: "Vigilante", desde: T.con, hasta: T.asi, render: (t0) => <Vigilante t0={t0} /> },
      { nombre: "Registro", desde: T.asi, hasta: T.unas, render: (t0) => <Registro t0={t0} /> },
      { nombre: "Balance", desde: T.unas, hasta: T.porEso, render: (t0) => <Balance t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Robo hormiga", T.guardarse, T.y, C.red],
      ["Evasión de impuestos", T.impuestos, T.con, C.white],
      ["El cliente audita", T.vigilante, T.asi, C.yellow],
    ]}
    tics={[0.94, T.trampa, T.guardarse, T.impuestos, T.gratis, T.escaparia]}
  />
);
