import narracion from "../../guion/mosca/narracion.json";
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
  Imagenes,
  Lento,
  Ojos,
  Salta,
  Techo,
  Truco,
  T,
} from "./Escenas";

export const DURACION_MOSCA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const MoscaReflejos: React.FC = () => (
  <Short
    carpeta="mosca"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.tu, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.tu, hasta: T.tus, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Imágenes", desde: T.tus, hasta: T.asi, render: (t0) => <Imagenes t0={t0} /> },
      { nombre: "Cámara lenta", desde: T.asi, hasta: T.sus, render: (t0) => <Lento t0={t0} /> },
      { nombre: "Ojos", desde: T.sus, hasta: T.en, render: (t0) => <Ojos t0={t0} /> },
      { nombre: "Salto", desde: T.en, hasta: T.camina, render: (t0) => <Salta t0={t0} /> },
      { nombre: "Techo", desde: T.camina, hasta: T.para, render: (t0) => <Techo t0={t0} /> },
      { nombre: "Truco", desde: T.para, hasta: T.porEso, render: (t0) => <Truco t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Ojo compuesto", T.lentes, T.en, C.white],
      ["Reflejo de escape", T.patas, T.camina, C.cyan],
    ]}
    tics={[1.0, T.doscientas, T.lo, T.lentes, T.salta, T.saltara + 0.3]}
  />
);
