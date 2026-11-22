import narracion from "../../guion/qi/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Alinea,
  Bobina,
  Bucle,
  Calor,
  Cierre,
  Gancho,
  Induccion,
  T,
} from "./Escenas";

export const DURACION_QI_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const CargaInalambrica: React.FC = () => (
  <Short
    carpeta="qi"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.dejas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.dejas, hasta: T.dentro, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Bobina", desde: T.dentro, hasta: T.celular, render: (t0) => <Bobina t0={t0} /> },
      { nombre: "Inducción", desde: T.celular, hasta: T.alineadas, render: (t0) => <Induccion t0={t0} /> },
      { nombre: "MagSafe", desde: T.alineadas, hasta: T.energia, render: (t0) => <Alinea t0={t0} /> },
      { nombre: "Calor", desde: T.energia, hasta: T.asi, render: (t0) => <Calor t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Inducción electromagnética", T.induce, T.alineadas, C.yellow],
      ["Pérdidas en calor", T.calor, T.asi, C.white],
    ]}
    tics={[0.6, T.induce, T.calor]}
  />
);
