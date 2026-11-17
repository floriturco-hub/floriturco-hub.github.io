import narracion from "../../guion/sifon/narracion.json";
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
  Peso,
  Presion,
  Regla,
  Subes,
  T,
} from "./Escenas";

export const DURACION_SIFON_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const Sifon: React.FC = () => (
  <Short
    carpeta="sifon"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.metes, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.metes, hasta: T.primero, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Regla", desde: T.primero, hasta: T.entonces, render: (t0) => <Regla t0={t0} /> },
      { nombre: "Peso", desde: T.entonces, hasta: T.presion, render: (t0) => <Peso t0={t0} /> },
      { nombre: "Presión", desde: T.presion, hasta: T.mientras, render: (t0) => <Presion t0={t0} /> },
      { nombre: "Subes", desde: T.mientras, hasta: T.asi, render: (t0) => <Subes t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Gravedad", T.pesa, T.presion, C.orange],
      ["Presión atmosférica", T.empuja, T.mientras, C.white],
    ]}
    tics={[0.7, T.caer, T.detiene]}
  />
);
