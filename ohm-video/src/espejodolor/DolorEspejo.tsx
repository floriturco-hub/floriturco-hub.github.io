import narracion from "../../guion/espejodolor/narracion.json";
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
  Dolor,
  Espejo,
  Fisico,
  Gancho,
  Tercio,
  T,
} from "./Escenas";

export const DURACION_ESPEJODOLOR_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const DolorEspejo: React.FC = () => (
  <Short
    carpeta="espejodolor"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.video, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.video, hasta: T.moverse, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Neuronas espejo", desde: T.moverse, hasta: T.dolor, render: (t0) => <Espejo t0={t0} /> },
      { nombre: "Dolor", desde: T.dolor, hasta: T.algunas, render: (t0) => <Dolor t0={t0} /> },
      { nombre: "Físico", desde: T.algunas, hasta: T.estudio, render: (t0) => <Fisico t0={t0} /> },
      { nombre: "Estudio", desde: T.estudio, hasta: T.porEso, render: (t0) => <Tercio t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Neuronas espejo", T.neuronas, T.dolor, C.yellow],
      ["Empatía del dolor", T.encienden, T.estudio, C.white],
    ]}
    tics={[0.6, T.corrientazo, T.encienden]}
  />
);
