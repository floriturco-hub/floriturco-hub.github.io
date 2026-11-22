import narracion from "../../guion/frenosaire/narracion.json";
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
  Falla,
  Gancho,
  Resorte,
  Servicio,
  Tanques,
  T,
} from "./Escenas";

export const DURACION_FRENOSAIRE_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const FrenosAire: React.FC = () => (
  <Short
    carpeta="frenosaire"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.trailer, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.trailer, hasta: T.compresor, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Tanques", desde: T.compresor, hasta: T.rueda, render: (t0) => <Tanques t0={t0} /> },
      { nombre: "Servicio", desde: T.rueda, hasta: T.resorte, render: (t0) => <Servicio t0={t0} /> },
      { nombre: "Resorte", desde: T.resorte, hasta: T.manguera, render: (t0) => <Resorte t0={t0} /> },
      { nombre: "Falla", desde: T.manguera, hasta: T.porEso, render: (t0) => <Falla t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Freno de resorte", T.resorte, T.manguera, C.yellow],
      ["A prueba de fallas", T.falla, T.porEso, C.white],
    ]}
    tics={[0.6, T.resorte, T.suelta]}
  />
);
