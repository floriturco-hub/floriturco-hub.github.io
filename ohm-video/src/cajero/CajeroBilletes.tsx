import narracion from "../../guion/cajero/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Casetes,
  Cierre,
  Doble,
  Gancho,
  Largo,
  Rechazo,
  Sensores,
  T,
} from "./Escenas";

export const DURACION_CAJERO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const CajeroBilletes: React.FC = () => (
  <Short
    carpeta="cajero"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho: cajero", desde: 0, hasta: T.ysi, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.ysi, hasta: T.dentro, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Casetes", desde: T.dentro, hasta: T.cada, render: (t0) => <Casetes t0={t0} /> },
      { nombre: "Sensores", desde: T.cada, hasta: T.si, render: (t0) => <Sensores t0={t0} /> },
      { nombre: "Dos pegados", desde: T.si, hasta: T.tambien, render: (t0) => <Doble t0={t0} /> },
      { nombre: "Largo", desde: T.tambien, hasta: T.ese, render: (t0) => <Largo t0={t0} /> },
      { nombre: "Rechazo", desde: T.ese, hasta: T.porque, render: (t0) => <Rechazo t0={t0} /> },
      { nombre: "Cierre", desde: T.porque, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Sensor de grosor", T.grosor, T.luz, C.white],
      ["Sensor óptico", T.luz, T.si, C.yellow],
      ["Doble grosor = error", T.duplica, T.tambien, C.red],
      ["Billete rechazado", T.rechazo, T.todo, C.red],
    ]}
    tics={[0.46, T.descubre, T.rodillo, T.luz, T.duplica, T.rechazo]}
  />
);
