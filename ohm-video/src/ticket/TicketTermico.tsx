import narracion from "../../guion/ticket/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Cabezal,
  Calor,
  Capa,
  Cierre,
  Frios,
  Gancho,
  Letras,
  Reaccion,
  T,
} from "./Escenas";

export const DURACION_TICKET_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const TicketTermico: React.FC = () => (
  <Short
    carpeta="ticket"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho: ticket", desde: 0, hasta: T.bueno, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.bueno, hasta: T.papel, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Capa", desde: T.papel, hasta: T.mientras, render: (t0) => <Capa t0={t0} /> },
      { nombre: "Fríos", desde: T.mientras, hasta: T.cabezal, render: (t0) => <Frios t0={t0} /> },
      { nombre: "Cabezal", desde: T.cabezal, hasta: T.donde, render: (t0) => <Cabezal t0={t0} /> },
      { nombre: "Reacción", desde: T.donde, hasta: T.punto, render: (t0) => <Reaccion t0={t0} /> },
      { nombre: "Letras", desde: T.punto, hasta: T.porEso, render: (t0) => <Letras t0={t0} /> },
      { nombre: "Calor y sol", desde: T.porEso, hasta: T.porque, render: (t0) => <Calor t0={t0} /> },
      { nombre: "Cierre", desde: T.porque, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Papel térmico", T.capa, T.mientras, C.white],
      ["Reacción química", T.une, T.punto, C.yellow],
      ["Calor = negro", T.entero, T.sol, C.orange],
    ]}
    tics={[1.16, T.acido, T.calientan, T.negro, T.entero, T.borran]}
  />
);
