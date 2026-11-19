import narracion from "../../guion/saciedad/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Cansancio,
  Cierre,
  Conexion,
  Gancho,
  Terapia,
  T,
} from "./Escenas";

export const DURACION_SACIEDAD_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const SaciedadSemantica: React.FC = () => (
  <Short
    carpeta="saciedad"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.escribes, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.escribes, hasta: T.llama, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Conexión", desde: T.llama, hasta: T.repites, render: (t0) => <Conexion t0={t0} /> },
      { nombre: "Cansancio", desde: T.repites, hasta: T.descansar, render: (t0) => <Cansancio t0={t0} /> },
      { nombre: "Terapia", desde: T.descansar, hasta: T.porEso, render: (t0) => <Terapia t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Saciedad semántica", T.lees, T.repites, C.yellow],
      ["Inhibición reactiva", T.cansan, T.descansar, C.white],
    ]}
    tics={[0.6, T.saciedad, T.terapeutas]}
  />
);
