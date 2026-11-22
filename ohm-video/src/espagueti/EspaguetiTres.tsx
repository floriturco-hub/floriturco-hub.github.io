import narracion from "../../guion/espagueti/narracion.json";
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
  Libera,
  Mit,
  Onda,
  Otra,
  Primera,
  T,
} from "./Escenas";

export const DURACION_ESPAGUETI_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const EspaguetiTres: React.FC = () => (
  <Short
    carpeta="espagueti"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.doblas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.doblas, hasta: T.cuando, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "1.ª rotura", desde: T.cuando, hasta: T.endereza, render: (t0) => <Primera t0={t0} /> },
      { nombre: "Onda", desde: T.endereza, hasta: T.ahi, render: (t0) => <Onda t0={t0} /> },
      { nombre: "2.ª rotura", desde: T.ahi, hasta: T.en2018, render: (t0) => <Otra t0={t0} /> },
      { nombre: "MIT", desde: T.en2018, hasta: T.soltarse, render: (t0) => <Mit t0={t0} /> },
      { nombre: "Truco", desde: T.soltarse, hasta: T.porEso, render: (t0) => <Libera t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Onda de flexión", T.onda, T.ahi, C.yellow],
      ["Torcer 3/4 de vuelta", T.torcerlo, T.porEso, C.white],
    ]}
    tics={[0.6, T.salen, T.primera, T.ahi, T.asi]}
  />
);
