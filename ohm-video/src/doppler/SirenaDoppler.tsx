import narracion from "../../guion/doppler/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Acerca,
  Aleja,
  Anillos,
  Bucle,
  Cierre,
  Conductor,
  Gancho,
  T,
} from "./Escenas";

export const DURACION_DOPPLER_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const SirenaDoppler: React.FC = () => (
  <Short
    carpeta="doppler"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.viene, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.viene, hasta: T.sonido, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Ondas", desde: T.sonido, hasta: T.cuando, render: (t0) => <Anillos t0={t0} /> },
      { nombre: "Se acerca", desde: T.cuando, hasta: T.cuando2, render: (t0) => <Acerca t0={t0} /> },
      { nombre: "Se aleja", desde: T.cuando2, hasta: T.efecto, render: (t0) => <Aleja t0={t0} /> },
      { nombre: "Conductor", desde: T.efecto, hasta: T.porEso, render: (t0) => <Conductor t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Frecuencia mayor", T.apretadas, T.cuando2, C.yellow],
      ["Frecuencia menor", T.estiradas, T.efecto, C.purpleLight],
      ["Efecto Doppler", T.conductor, T.porEso, C.cyan],
    ]}
    tics={[0.7, T.agudo, T.grave2]}
  />
);
