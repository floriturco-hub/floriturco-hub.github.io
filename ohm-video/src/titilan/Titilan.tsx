import narracion from "../../guion/titilan/narracion.json";
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
  Disco,
  Gancho,
  Horizonte,
  Punto,
  T,
} from "./Escenas";

export const DURACION_TITILAN_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const Titilan: React.FC = () => (
  <Short
    carpeta="titilan"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.titilan, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.titilan, hasta: T.lejos, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Punto", desde: T.lejos, hasta: T.planeta, render: (t0) => <Punto t0={t0} /> },
      { nombre: "Disco", desde: T.planeta, hasta: T.horizonte, render: (t0) => <Disco t0={t0} /> },
      { nombre: "Horizonte", desde: T.horizonte, hasta: T.porEso, render: (t0) => <Horizonte t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Centelleo", T.aire, T.planeta, C.orange],
    ]}
    tics={[0.6, T.baila, T.compensan]}
  />
);
