import narracion from "../../guion/huellas/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Azar,
  Bucle,
  Cierre,
  Formacion,
  Gancho,
  Koala,
  Tipos,
  T,
} from "./Escenas";

export const DURACION_HUELLAS_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const HuellasGemelos: React.FC = () => (
  <Short
    carpeta="huellas"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.gemelos, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.gemelos, hasta: T.nacer, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Formacion", desde: T.nacer, hasta: T.adn2, render: (t0) => <Formacion t0={t0} /> },
      { nombre: "Tipos", desde: T.adn2, hasta: T.azar, render: (t0) => <Tipos t0={t0} /> },
      { nombre: "Azar", desde: T.azar, hasta: T.koalas, render: (t0) => <Azar t0={t0} /> },
      { nombre: "Koala", desde: T.koalas, hasta: T.porEso, render: (t0) => <Koala t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Dermatoglifos", T.crestas, T.adn2, C.yellow],
    ]}
    tics={[0.6, T.crestas, T.azar]}
  />
);
