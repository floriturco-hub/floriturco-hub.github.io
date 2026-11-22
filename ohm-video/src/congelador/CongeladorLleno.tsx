import narracion from "../../guion/congelador/narracion.json";
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
  Gancho,
  Puerta,
  Refri,
  Truco,
  T,
} from "./Escenas";

export const DURACION_CONGELADOR_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const CongeladorLleno: React.FC = () => (
  <Short
    carpeta="congelador"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.ahorra, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.ahorra, hasta: T.puerta, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Puerta", desde: T.puerta, hasta: T.refrigerador2, render: (t0) => <Puerta t0={t0} /> },
      { nombre: "Refri", desde: T.refrigerador2, hasta: T.truco, render: (t0) => <Refri t0={t0} /> },
      { nombre: "Truco", desde: T.truco, hasta: T.porEso, render: (t0) => <Truco t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Inercia térmica", T.bateria, T.refrigerador2, C.cyan],
      ["Circulación del aire", T.circular, T.truco, C.white],
    ]}
    tics={[0.6, T.lleno, T.atiborras]}
  />
);
