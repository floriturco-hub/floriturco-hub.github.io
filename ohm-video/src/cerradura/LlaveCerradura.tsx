import narracion from "../../guion/cerradura/narracion.json";
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
  Dientes,
  Gancho,
  Maestra,
  Pernos,
  T,
} from "./Escenas";

export const DURACION_CERRADURA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const LlaveCerradura: React.FC = () => (
  <Short
    carpeta="cerradura"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.cualquiera, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.cualquiera, hasta: T.cilindro, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Pernos", desde: T.cilindro, hasta: T.dientes, render: (t0) => <Pernos t0={t0} /> },
      { nombre: "Dientes", desde: T.dientes, hasta: T.maestra, render: (t0) => <Dientes t0={t0} /> },
      { nombre: "Llave maestra", desde: T.maestra, hasta: T.asi, render: (t0) => <Maestra t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Cerradura de pernos", T.pernos, T.dientes, C.white],
      ["Línea de corte", T.alineados, T.maestra, C.yellow],
    ]}
    tics={[0.6, T.alineados, T.maestra]}
  />
);
