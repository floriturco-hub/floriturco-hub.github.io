import narracion from "../../guion/feria/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Aros,
  Baloncesto,
  Botellas,
  Bucle,
  Cierre,
  Fisica,
  Gancho,
  T,
} from "./Escenas";

export const DURACION_FERIA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const JuegosFeria: React.FC = () => (
  <Short
    carpeta="feria"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.feria, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.feria, hasta: T.botellas2, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Botellas", desde: T.botellas2, hasta: T.aros, render: (t0) => <Botellas t0={t0} /> },
      { nombre: "Aros", desde: T.aros, hasta: T.baloncesto, render: (t0) => <Aros t0={t0} /> },
      { nombre: "Baloncesto", desde: T.baloncesto, hasta: T.mala, render: (t0) => <Baloncesto t0={t0} /> },
      { nombre: "Física", desde: T.mala, hasta: T.porEso, render: (t0) => <Fisica t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Impulso insuficiente", T.impulso, T.aros, C.white],
      ["Rebote elástico", T.inflada, T.mala, C.yellow],
    ]}
    tics={[0.6, T.impulso, T.entrar]}
  />
);
