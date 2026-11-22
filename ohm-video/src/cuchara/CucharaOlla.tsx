import narracion from "../../guion/cuchara/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Cadena,
  Cierre,
  Espuma,
  Gancho,
  Moja,
  Toca,
  T,
} from "./Escenas";

export const DURACION_CUCHARA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const CucharaOlla: React.FC = () => (
  <Short
    carpeta="cuchara"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.olla, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.olla, hasta: T.burbujas, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Espuma", desde: T.burbujas, hasta: T.cuando, render: (t0) => <Espuma t0={t0} /> },
      { nombre: "Contacto", desde: T.cuando, hasta: T.vienen, render: (t0) => <Toca t0={t0} /> },
      { nombre: "Cadena", desde: T.vienen, hasta: T.pero, render: (t0) => <Cadena t0={t0} /> },
      { nombre: "Mojada", desde: T.pero, hasta: T.porEso, render: (t0) => <Moja t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Espuma de almidón", T.almidon, T.cuando, C.yellow],
      ["Condensación", T.condensa, T.vienen, C.cyan],
    ]}
    tics={[0.7, T.revienta, T.deja]}
  />
);
