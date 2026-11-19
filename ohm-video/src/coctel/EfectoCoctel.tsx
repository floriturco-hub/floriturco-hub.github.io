import narracion from "../../guion/coctel/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Alarma,
  Bucle,
  Cierre,
  Filtro,
  Gancho,
  Nombre,
  Tercio,
  T,
} from "./Escenas";

export const DURACION_COCTEL_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const EfectoCoctel: React.FC = () => (
  <Short
    carpeta="coctel"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.fiesta, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.fiesta, hasta: T.llama, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Efecto cóctel", desde: T.llama, hasta: T.cerebro, render: (t0) => <Nombre t0={t0} /> },
      { nombre: "Filtro", desde: T.cerebro, hasta: T.importante, render: (t0) => <Filtro t0={t0} /> },
      { nombre: "Alarma", desde: T.importante, hasta: T.experimentos, render: (t0) => <Alarma t0={t0} /> },
      { nombre: "Experimento", desde: T.experimentos, hasta: T.asi, render: (t0) => <Tercio t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Atención selectiva", T.elige, T.importante, C.yellow],
      ["Tu nombre activa la alarma", T.alarma, T.experimentos, C.white],
    ]}
    tics={[0.6, T.efecto, T.alarma]}
  />
);
