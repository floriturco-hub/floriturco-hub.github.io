import narracion from "../../guion/sim/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Aire,
  Bucle,
  Calculo,
  Cierre,
  Clave,
  Desafio,
  Esim,
  Gancho,
  Ok,
  T,
} from "./Escenas";

export const DURACION_SIM_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const TarjetaSim: React.FC = () => (
  <Short
    carpeta="sim"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.lo, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.lo, hasta: T.la, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Clave", desde: T.la, hasta: T.cuando, render: (t0) => <Clave t0={t0} /> },
      { nombre: "Desafío", desde: T.cuando, hasta: T.laSim, render: (t0) => <Desafio t0={t0} /> },
      { nombre: "Cálculo", desde: T.laSim, hasta: T.si, render: (t0) => <Calculo t0={t0} /> },
      { nombre: "Eres tú", desde: T.si, hasta: T.clave2, render: (t0) => <Ok t0={t0} /> },
      { nombre: "Aire", desde: T.clave2, hasta: T.hoy, render: (t0) => <Aire t0={t0} /> },
      { nombre: "eSIM", desde: T.hoy, hasta: T.eso, render: (t0) => <Esim t0={t0} /> },
      { nombre: "Cierre", desde: T.eso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Clave Ki", T.clave, T.cuando, C.white],
      ["Desafío y respuesta", T.mezcla, T.si, C.yellow],
      ["Autenticación", T.llamar, T.clave2, C.cyan],
    ]}
    tics={[0.78, T.operador, T.examen, T.compara, T.si + 0.3, T.esim]}
  />
);
