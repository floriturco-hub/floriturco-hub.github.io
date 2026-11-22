import narracion from "../../guion/buscapolos/narracion.json";
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
  Circuito,
  Gancho,
  Mango,
  Neutro,
  Seguro,
  T,
} from "./Escenas";

export const DURACION_BUSCAPOLOS_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const BuscaPolos: React.FC = () => (
  <Short
    carpeta="buscapolos"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.tocas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.tocas, hasta: T.mango, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Mango", desde: T.mango, hasta: T.fase, render: (t0) => <Mango t0={t0} /> },
      { nombre: "Circuito", desde: T.fase, hasta: T.neon2, render: (t0) => <Circuito t0={t0} /> },
      { nombre: "Neutro", desde: T.neon2, hasta: T.resistencia2, render: (t0) => <Neutro t0={t0} /> },
      { nombre: "Seguridad", desde: T.resistencia2, hasta: T.asi, render: (t0) => <Seguro t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Lámpara de neón", T.neon, T.fase, C.yellow],
      ["Resistencia de alto valor", T.resistencia2, T.asi, C.white],
    ]}
    tics={[0.6, T.circuito, T.diminuta]}
  />
);
