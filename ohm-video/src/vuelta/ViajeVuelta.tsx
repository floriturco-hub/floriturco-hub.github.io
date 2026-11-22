import narracion from "../../guion/vuelta/narracion.json";
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
  Compara,
  Gancho,
  Ida,
  Nombre,
  Vuelta,
  T,
} from "./Escenas";

export const DURACION_VUELTA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const ViajeVuelta: React.FC = () => (
  <Short
    carpeta="vuelta"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.nuevo, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.nuevo, hasta: T.llama, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Efecto", desde: T.llama, hasta: T.expectativas, render: (t0) => <Nombre t0={t0} /> },
      { nombre: "Ida", desde: T.expectativas, hasta: T.vuelta2, render: (t0) => <Ida t0={t0} /> },
      { nombre: "Vuelta", desde: T.vuelta2, hasta: T.mide, render: (t0) => <Vuelta t0={t0} /> },
      { nombre: "Comparación", desde: T.mide, hasta: T.porEso, render: (t0) => <Compara t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Efecto del viaje de vuelta", T.efecto, T.creia, C.yellow],
      ["Expectativas violadas", T.expectativas, T.mide, C.white],
    ]}
    tics={[0.6, T.efecto, T.expectativas]}
  />
);
