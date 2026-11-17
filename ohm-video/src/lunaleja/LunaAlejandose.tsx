import narracion from "../../guion/lunaleja/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Arrastra,
  Bucle,
  Cierre,
  Frena,
  Gancho,
  Mareas,
  Pasado,
  Tira,
  T,
} from "./Escenas";

export const DURACION_LUNALEJA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const LunaAlejandose: React.FC = () => (
  <Short
    carpeta="lunaleja"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.cada, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.cada, hasta: T.gravedad, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Mareas", desde: T.gravedad, hasta: T.pero, render: (t0) => <Mareas t0={t0} /> },
      { nombre: "Bulto adelantado", desde: T.pero, hasta: T.adelantado, render: (t0) => <Arrastra t0={t0} /> },
      { nombre: "Tirón", desde: T.adelantado, hasta: T.cambio, render: (t0) => <Tira t0={t0} /> },
      { nombre: "Frenado", desde: T.cambio, hasta: T.cuatrocientos, render: (t0) => <Frena t0={t0} /> },
      { nombre: "Pasado", desde: T.cuatrocientos, hasta: T.porEso, render: (t0) => <Pasado t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Fuerza de marea", T.estira, T.pero, C.cyan],
      ["Transferencia de momento", T.energia, T.cambio, C.yellow],
      ["Frenado de marea", T.frena, T.cuatrocientos, C.red],
    ]}
    tics={[0.7, T.alta, T.veintidos]}
  />
);
