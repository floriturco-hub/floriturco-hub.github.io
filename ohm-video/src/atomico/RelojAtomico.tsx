import narracion from "../../guion/atomico/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Ajuste,
  Bucle,
  Cesio,
  Cierre,
  Fallas,
  Gancho,
  Gps,
  Repite,
  Salto,
  T,
} from "./Escenas";

export const DURACION_ATOMICO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const RelojAtomico: React.FC = () => (
  <Short
    carpeta="atomico"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho: reloj atómico", desde: 0, hasta: T.ni, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.ni, hasta: T.todo, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Repite", desde: T.todo, hasta: T.pero, render: (t0) => <Repite t0={t0} /> },
      { nombre: "Fallas", desde: T.pero, hasta: T.atomico, render: (t0) => <Fallas t0={t0} /> },
      { nombre: "Cesio", desde: T.atomico, hasta: T.electron, render: (t0) => <Cesio t0={t0} /> },
      { nombre: "Salto", desde: T.electron, hasta: T.ajusta, render: (t0) => <Salto t0={t0} /> },
      { nombre: "Ajuste", desde: T.ajusta, hasta: T.gps, render: (t0) => <Ajuste t0={t0} /> },
      { nombre: "GPS", desde: T.gps, hasta: T.porque, render: (t0) => <Gps t0={t0} /> },
      { nombre: "Cierre", desde: T.porque, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Átomo de cesio-133", T.cesio, T.electron, C.white],
      ["Así se define el segundo", T.vibraciones, T.ajusta, C.yellow],
      ["Corrección constante", T.corrige, T.gps, C.cyan],
    ]}
    tics={[1.08, T.pendulo, T.calor, T.microonda + 1.0, T.maximo, T.gps]}
  />
);
