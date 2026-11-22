import narracion from "../../guion/relojauto/narracion.json";
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
  Cuerda,
  Embrague,
  Escape,
  Gancho,
  Reserva,
  Rotor,
  T,
} from "./Escenas";

export const DURACION_RELOJAUTO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const RelojAutomatico: React.FC = () => (
  <Short
    carpeta="relojauto"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.automatico, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.automatico, hasta: T.rotor, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Rotor", desde: T.rotor, hasta: T.engranes, render: (t0) => <Rotor t0={t0} /> },
      { nombre: "Cuerda", desde: T.engranes, hasta: T.escape, render: (t0) => <Cuerda t0={t0} /> },
      { nombre: "Escape", desde: T.escape, hasta: T.llena, render: (t0) => <Escape t0={t0} /> },
      { nombre: "Embrague", desde: T.llena, hasta: T.quitas, render: (t0) => <Embrague t0={t0} /> },
      { nombre: "Reserva", desde: T.quitas, hasta: T.asi, render: (t0) => <Reserva t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Remontaje automático", T.rotor, T.engranes, C.yellow],
      ["Escape y volante", T.volante, T.llena, C.white],
    ]}
    tics={[0.6, T.rotor, T.volante]}
  />
);
