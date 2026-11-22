import narracion from "../../guion/clavos/narracion.json";
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
  Conduccion,
  Gancho,
  Pasos,
  UnClavo,
  T,
} from "./Escenas";

export const DURACION_CLAVOS_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const CamaClavos: React.FC = () => (
  <Short
    carpeta="clavos"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.acuesta, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.acuesta, hasta: T.solo, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Clavos", desde: T.solo, hasta: T.carbon, render: (t0) => <UnClavo t0={t0} /> },
      { nombre: "Brasas", desde: T.carbon, hasta: T.rapidos, render: (t0) => <Conduccion t0={t0} /> },
      { nombre: "Pasos rápidos", desde: T.rapidos, hasta: T.porEso, render: (t0) => <Pasos t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Presión = fuerza / área", T.mil, T.carbon, C.yellow],
      ["Baja conductividad térmica", T.conducen, T.rapidos, C.white],
    ]}
    tics={[0.6, T.mil, T.quemas]}
  />
);
