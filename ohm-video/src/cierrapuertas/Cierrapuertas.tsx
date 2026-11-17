import narracion from "../../guion/cierrapuertas/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Aceite,
  Bucle,
  Cierre,
  Empujon,
  Gancho,
  Interior,
  Tornillo,
  T,
} from "./Escenas";

export const DURACION_CIERRAPUERTAS_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const Cierrapuertas: React.FC = () => (
  <Short
    carpeta="cierrapuertas"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.sueltas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.sueltas, hasta: T.arriba, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Interior", desde: T.arriba, hasta: T.pero, render: (t0) => <Interior t0={t0} /> },
      { nombre: "Aceite", desde: T.pero, hasta: T.tornillo, render: (t0) => <Aceite t0={t0} /> },
      { nombre: "Regulación", desde: T.tornillo, hasta: T.final2, render: (t0) => <Tornillo t0={t0} /> },
      { nombre: "Empujón final", desde: T.final2, hasta: T.porEso, render: (t0) => <Empujon t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Amortiguación hidráulica", T.agujeros, T.tornillo, C.yellow],
      ["Válvula de cierre", T.valvula, T.porEso, C.cyan],
    ]}
    tics={[0.7, T.frena, T.acelere]}
  />
);
