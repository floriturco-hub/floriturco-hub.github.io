import narracion from "../../guion/escalera/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Atora,
  Bucle,
  Cierre,
  Gancho,
  Juntan,
  PeineMetal,
  Ruedas,
  Separan,
  Vuelta,
  T,
} from "./Escenas";

export const DURACION_ESCALERA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const EscaleraElectrica: React.FC = () => (
  <Short
    carpeta="escalera"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.llegas, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.llegas, hasta: T.cada, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Ruedas", desde: T.cada, hasta: T.en, render: (t0) => <Ruedas t0={t0} /> },
      { nombre: "Subida", desde: T.en, hasta: T.al, render: (t0) => <Separan t0={t0} /> },
      { nombre: "Arriba", desde: T.al, hasta: T.luego, render: (t0) => <Juntan t0={t0} /> },
      { nombre: "Vuelta", desde: T.luego, hasta: T.y, render: (t0) => <Vuelta t0={t0} /> },
      { nombre: "Peine", desde: T.y, hasta: T.si, render: (t0) => <PeineMetal t0={t0} /> },
      { nombre: "Zapato atorado", desde: T.si, hasta: T.porEso, render: (t0) => <Atora t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Dos rieles por escalón", T.rieles, T.en, C.white],
      ["Bucle de cadena", T.vuelta, T.y, C.cyan],
      ["Parada de emergencia", T.freno, T.porEso, C.red],
    ]}
    tics={[0.72, T.rieles, T.separan, T.juntan, T.peine, T.freno]}
  />
);
