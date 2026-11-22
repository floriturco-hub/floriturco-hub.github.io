import narracion from "../../guion/torres/narracion.json";
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
  Grupos,
  Pelotas,
  Suma,
  Trifasica,
  T,
} from "./Escenas";

export const DURACION_TORRES_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const TorresAltaTension: React.FC = () => (
  <Short
    carpeta="torres"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.bastan, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.bastan, hasta: T.trifasica, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Trifásica", desde: T.trifasica, hasta: T.instante, render: (t0) => <Trifasica t0={t0} /> },
      { nombre: "Suma cero", desde: T.instante, hasta: T.grupos, render: (t0) => <Suma t0={t0} /> },
      { nombre: "Circuitos", desde: T.grupos, hasta: T.pelotas, render: (t0) => <Grupos t0={t0} /> },
      { nombre: "Marcadores", desde: T.pelotas, hasta: T.porEso, render: (t0) => <Pelotas t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Corriente trifásica", T.trifasica, T.instante, C.yellow],
      ["Sistema equilibrado", T.otros, T.grupos, C.white],
      ["Balizas de aviación", T.marcadores, T.porEso, C.orange],
    ]}
    tics={[0.7, T.otros, T.pelotas]}
  />
);
