import narracion from "../../guion/retrovisor/narracion.json";
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
  Electro,
  Gancho,
  Gel,
  Pasa,
  Sensores,
  T,
} from "./Escenas";

export const DURACION_RETROVISOR_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const RetrovisorAuto: React.FC = () => (
  <Short
    carpeta="retrovisor"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.el, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.el, hasta: T.espejo, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Sensores", desde: T.espejo, hasta: T.entonces, render: (t0) => <Sensores t0={t0} /> },
      { nombre: "Gel", desde: T.entonces, hasta: T.electro, render: (t0) => <Gel t0={t0} /> },
      { nombre: "Electrocrómico", desde: T.electro, hasta: T.reflejo, render: (t0) => <Electro t0={t0} /> },
      { nombre: "Pasa", desde: T.reflejo, hasta: T.porEso, render: (t0) => <Pasa t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Dos fotosensores", T.sensores, T.noche, C.white],
      ["Espejo electrocrómico", T.electro, T.reflejo, C.cyan],
      ["Automático", T.aclara, T.porEso, C.yellow],
    ]}
    tics={[0.4, T.sensores, T.deslumbrando, T.gel, T.oscurece2, T.aclara]}
  />
);
