import narracion from "../../guion/fibra/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Aplasta,
  Bucle,
  Cierre,
  Gancho,
  Grietas,
  Hilos,
  Tension,
  Titan,
  T,
} from "./Escenas";

export const DURACION_FIBRA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const FibraCarbono: React.FC = () => (
  <Short
    carpeta="fibra"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.si, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.si, hasta: T.la, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Hilos", desde: T.la, hasta: T.estirados, render: (t0) => <Hilos t0={t0} /> },
      { nombre: "Tensión", desde: T.estirados, hasta: T.pero, render: (t0) => <Tension t0={t0} /> },
      { nombre: "Aplasta", desde: T.pero, hasta: T.comprimida, render: (t0) => <Aplasta t0={t0} /> },
      { nombre: "Grietas", desde: T.comprimida, hasta: T.en, render: (t0) => <Grietas t0={t0} /> },
      { nombre: "Titán", desde: T.en, hasta: T.porEso, render: (t0) => <Titan t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Compuesto: fibra + resina", T.resina, T.estirados, C.white],
      ["Fuerte a tracción", T.estirados + 1, T.pero, C.yellow],
      ["Débil a compresión", T.peor, T.en, C.red],
    ]}
    tics={[0.6, T.cinco, T.resina, T.aplasta, T.grietas, T.implosiono]}
  />
);
