import narracion from "../../guion/aguacate/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Celulas,
  Cierre,
  Gancho,
  Pigmento,
  Remedios,
  Semilla,
  T,
} from "./Escenas";

export const DURACION_AGUACATE_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const AguacateCafe: React.FC = () => (
  <Short
    carpeta="aguacate"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.cortas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.cortas, hasta: T.cortarlo, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Células", desde: T.cortarlo, hasta: T.oxigeno, render: (t0) => <Celulas t0={t0} /> },
      { nombre: "Pigmento", desde: T.oxigeno, hasta: T.podrido, render: (t0) => <Pigmento t0={t0} /> },
      { nombre: "Remedios", desde: T.podrido, hasta: T.semilla, render: (t0) => <Remedios t0={t0} /> },
      { nombre: "Semilla", desde: T.semilla, hasta: T.porEso, render: (t0) => <Semilla t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Pardeamiento enzimático", T.transforma, T.podrido, C.yellow],
      ["Polifenol oxidasa", T.acido, T.semilla, C.white],
    ]}
    tics={[0.6, T.unen, T.resto]}
  />
);
