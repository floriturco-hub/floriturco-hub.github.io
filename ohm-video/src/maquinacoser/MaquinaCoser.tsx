import narracion from "../../guion/maquinacoser/narracion.json";
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
  Garfio,
  Lazada,
  Puntada,
  Velocidad,
  T,
} from "./Escenas";

export const DURACION_MAQUINACOSER_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const MaquinaCoser: React.FC = () => (
  <Short
    carpeta="maquinacoser"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.hilos, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.hilos, hasta: T.ojo, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Lazada", desde: T.ojo, hasta: T.gancho, render: (t0) => <Lazada t0={t0} /> },
      { nombre: "Garfio", desde: T.gancho, hasta: T.tensan, render: (t0) => <Garfio t0={t0} /> },
      { nombre: "Puntada", desde: T.tensan, hasta: T.repite, render: (t0) => <Puntada t0={t0} /> },
      { nombre: "Velocidad", desde: T.repite, hasta: T.asi, render: (t0) => <Velocidad t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Lanzadera rotativa", T.atrapa, T.tensan, C.white],
      ["Pespunte", T.puntada, T.repite, C.yellow],
    ]}
    tics={[0.6, T.lazada, T.puntada]}
  />
);
