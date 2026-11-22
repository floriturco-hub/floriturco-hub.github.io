import narracion from "../../guion/ollapresion/narracion.json";
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
  Gancho,
  Presion,
  Seguros,
  Traba,
  T,
} from "./Escenas";

export const DURACION_OLLASEGUROS_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const OllaSeguros: React.FC = () => (
  <Short
    carpeta="ollapresion"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.viejas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.viejas, hasta: T.cerrar, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Presion", desde: T.cerrar, hasta: T.valvula, render: (t0) => <Presion t0={t0} /> },
      { nombre: "Seguros", desde: T.valvula, hasta: T.tapa, render: (t0) => <Seguros t0={t0} /> },
      { nombre: "Traba", desde: T.tapa, hasta: T.porEso, render: (t0) => <Traba t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Válvulas de seguridad", T.valvula, T.tapa, C.orange],
    ]}
    tics={[0.6, T.segunda, T.traba]}
  />
);
