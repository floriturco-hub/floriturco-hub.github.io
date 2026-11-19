import narracion from "../../guion/luminol/narracion.json";
import {
  COLA_CORTA,
  duracionShort,
  palabrasDe,
  Short,
} from "../components/Short";
import { C } from "../theme";
import {
  Cierre,
  Engano,
  Funciona,
  Gancho,
  Quimica,
  Rocian,
  T,
  Trampa,
} from "./Escenas";

export const DURACION_LUMINOL_S = duracionShort(T.fin, COLA_CORTA);

// Primer video con las reglas de retención (estilo.md §10): ~36 s, bucle abierto,
// subtítulos palabra a palabra, logo corto y final que enlaza con el inicio.
export const LuminolSangre: React.FC = () => (
  <Short
    carpeta="luminol"
    cola={COLA_CORTA}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      {
        nombre: "Gancho: brilla",
        desde: 0,
        hasta: T.producto,
        render: (t0) => <Gancho t0={t0} />,
      },
      {
        nombre: "Engaño",
        desde: T.producto,
        hasta: T.luminol,
        render: (t0) => <Engano t0={t0} />,
      },
      {
        nombre: "Rocían",
        desde: T.luminol,
        hasta: T.porque,
        render: (t0) => <Rocian t0={t0} />,
      },
      {
        nombre: "Química",
        desde: T.porque,
        hasta: T.funciona,
        render: (t0) => <Quimica t0={t0} />,
      },
      {
        nombre: "Funciona",
        desde: T.funciona,
        hasta: T.trampa,
        render: (t0) => <Funciona t0={t0} />,
      },
      {
        nombre: "Trampa",
        desde: T.trampa,
        hasta: T.porque2,
        render: (t0) => <Trampa t0={t0} />,
      },
      {
        nombre: "Cierre",
        desde: T.porque2,
        hasta: T.fin,
        render: (t0) => <Cierre t0={t0} />,
      },
    ]}
    etiquetas={[
      ["Luminol", T.luminol, T.apagan, C.cyan],
      ["El hierro de la sangre", T.hierro, T.luz, C.orange],
      ["Química que da luz", T.luz, T.funciona, C.cyan],
      ["Aunque no se vea", T.invisible, T.trampa, C.white],
      ["La lejía: un destello", T.apaga, T.porque2, C.yellow],
    ]}
    tics={[1.0, T.apagan, T.luz, T.diluida, T.apaga, T.culpable]}
  />
);
