import narracion from "../../guion/frenos/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Acero,
  Bucle,
  Carbono,
  Cierre,
  Gancho,
  Material,
  Vuelta,
  T,
} from "./Escenas";

export const DURACION_FRENOS_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const FrenosCarbono: React.FC = () => (
  <Short
    carpeta="frenos"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.carreras, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.carreras, hasta: T.hechos, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Carbono-carbono", desde: T.hechos, hasta: T.frenar, render: (t0) => <Material t0={t0} /> },
      { nombre: "Acero", desde: T.frenar, hasta: T.cambio, render: (t0) => <Acero t0={t0} /> },
      { nombre: "Carbono", desde: T.cambio, hasta: T.frio, render: (t0) => <Carbono t0={t0} /> },
      { nombre: "Vuelta previa", desde: T.frio, hasta: T.porEso, render: (t0) => <Vuelta t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Compuesto carbono-carbono", T.fibras, T.frenar, C.white],
      ["Coeficiente de fricción", T.friccion, T.frio, C.orange],
    ]}
    tics={[0.7, T.sube, T.zigzaguean]}
  />
);
