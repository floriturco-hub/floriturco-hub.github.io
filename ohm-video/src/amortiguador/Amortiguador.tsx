import narracion from "../../guion/amortiguador/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Calor,
  Cierre,
  Dentro,
  Gancho,
  Prueba,
  Resorte,
  T,
} from "./Escenas";

export const DURACION_AMORTIGUADOR_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const Amortiguador: React.FC = () => (
  <Short
    carpeta="amortiguador"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.rueda, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.rueda, hasta: T.guarda, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Resorte", desde: T.guarda, hasta: T.dentro, render: (t0) => <Resorte t0={t0} /> },
      { nombre: "Amortiguador", desde: T.dentro, hasta: T.calor, render: (t0) => <Dentro t0={t0} /> },
      { nombre: "Amortiguación", desde: T.calor, hasta: T.empuja, render: (t0) => <Calor t0={t0} /> },
      { nombre: "Prueba", desde: T.empuja, hasta: T.porEso, render: (t0) => <Prueba t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Amortiguador hidráulico", T.amortiguador, T.calor, C.yellow],
      ["Oscilación amortiguada", T.vaiven, T.empuja, C.white],
    ]}
    tics={[0.6, T.amortiguador, T.gastados]}
  />
);
