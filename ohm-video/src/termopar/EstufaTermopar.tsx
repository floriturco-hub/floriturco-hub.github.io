import narracion from "../../guion/termopar/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Cierra,
  Cierre,
  Gancho,
  Iman,
  Perilla,
  Termopar,
  T,
} from "./Escenas";

export const DURACION_TERMOPAR_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const EstufaTermopar: React.FC = () => (
  <Short
    carpeta="termopar"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.corriente, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.corriente, hasta: T.junto, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Termopar", desde: T.junto, hasta: T.alimenta, render: (t0) => <Termopar t0={t0} /> },
      { nombre: "Electroimán", desde: T.alimenta, hasta: T.enfria, render: (t0) => <Iman t0={t0} /> },
      { nombre: "Válvula", desde: T.enfria, hasta: T.sostienes, render: (t0) => <Cierra t0={t0} /> },
      { nombre: "Perilla", desde: T.sostienes, hasta: T.asi, render: (t0) => <Perilla t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Efecto Seebeck", T.voltaje, T.alimenta, C.yellow],
      ["Válvula de seguridad", T.resorte, T.sostienes, C.white],
    ]}
    tics={[0.6, T.voltaje, T.resorte]}
  />
);
