import narracion from "../../guion/cortaunas/narracion.json";
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
  Filo,
  Gancho,
  Hojas,
  Palanca,
  T,
} from "./Escenas";

export const DURACION_CORTAUNAS_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const Cortaunas: React.FC = () => (
  <Short
    carpeta="cortaunas"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.una, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.una, hasta: T.secreto, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Palanca", desde: T.secreto, hasta: T.hojas, render: (t0) => <Palanca t0={t0} /> },
      { nombre: "Hojas", desde: T.hojas, hasta: T.diminuto, render: (t0) => <Hojas t0={t0} /> },
      { nombre: "Filo", desde: T.diminuto, hasta: T.porEso, render: (t0) => <Filo t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Palanca de segundo grado", T.apoyo, T.hojas, C.yellow],
      ["Palanca de tercer grado", T.esa, T.diminuto, C.cyan],
      ["Presión concentrada", T.concentra, T.porEso, C.red],
    ]}
    tics={[0.7, T.multiplica, T.presion]}
  />
);
