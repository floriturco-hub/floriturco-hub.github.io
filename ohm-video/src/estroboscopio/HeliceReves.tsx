import narracion from "../../guion/estroboscopio/narracion.json";
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
  Fotos,
  Gancho,
  Lineas,
  Quieta,
  Reves,
  T,
} from "./Escenas";

export const DURACION_ESTROBOSCOPIO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const HeliceReves: React.FC = () => (
  <Short
    carpeta="estroboscopio"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.video, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.video, hasta: T.camara, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Fotos", desde: T.camara, hasta: T.si, render: (t0) => <Fotos t0={t0} /> },
      { nombre: "Quieta", desde: T.si, hasta: T.si2, render: (t0) => <Quieta t0={t0} /> },
      { nombre: "Al revés", desde: T.si2, hasta: T.muchas, render: (t0) => <Reves t0={t0} /> },
      { nombre: "Rolling shutter", desde: T.muchas, hasta: T.porEso, render: (t0) => <Lineas t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Efecto estroboscópico", T.completa, T.muchas, C.yellow],
      ["Obturador de barrido", T.linea, T.porEso, C.red],
    ]}
    tics={[0.7, T.quieta, T.doblada]}
  />
);
