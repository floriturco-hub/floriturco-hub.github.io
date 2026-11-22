import narracion from "../../guion/gota/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bloqueo,
  Bucle,
  Canal,
  Cierre,
  Gancho,
  Tapon,
  Truco,
  T,
} from "./Escenas";

export const DURACION_GOTA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const AguaOido: React.FC = () => (
  <Short
    carpeta="gota"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.sales, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.sales, hasta: T.canal, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Canal auditivo", desde: T.canal, hasta: T.fino, render: (t0) => <Canal t0={t0} /> },
      { nombre: "Tapón", desde: T.fino, hasta: T.salir, render: (t0) => <Tapon t0={t0} /> },
      { nombre: "Bloqueo", desde: T.salir, hasta: T.truco2, render: (t0) => <Bloqueo t0={t0} /> },
      { nombre: "El truco", desde: T.truco2, hasta: T.porEso, render: (t0) => <Truco t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Cerumen hidrófobo", T.cerumen, T.fino, C.yellow],
      ["Tensión superficial", T.tension, T.salir, C.cyan],
    ]}
    tics={[0.7, T.curva, T.cae]}
  />
);
