import narracion from "../../guion/tenedor/narracion.json";
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
  Electrones,
  Gancho,
  Paredes,
  Punta,
  Rayo,
  T,
} from "./Escenas";

export const DURACION_TENEDOR_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const TenedorMicroondas: React.FC = () => (
  <Short
    carpeta="tenedor"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.cuchara, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.cuchara, hasta: T.empujan, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Electrones", desde: T.empujan, hasta: T.punta, render: (t0) => <Electrones t0={t0} /> },
      { nombre: "Punta", desde: T.punta, hasta: T.puntas, render: (t0) => <Punta t0={t0} /> },
      { nombre: "Rayo", desde: T.puntas, hasta: T.paredes, render: (t0) => <Rayo t0={t0} /> },
      { nombre: "Paredes", desde: T.paredes, hasta: T.porEso, render: (t0) => <Paredes t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Efecto punta", T.amontonan, T.puntas, C.yellow],
      ["Descarga en el aire", T.rayo, T.paredes, C.white],
    ]}
    tics={[0.6, T.enorme, T.rayo]}
  />
);
