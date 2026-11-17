import narracion from "../../guion/diesel/narracion.json";
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
  Compresion,
  Frio,
  Gancho,
  Gasolina,
  Inyeccion,
  T,
} from "./Escenas";

export const DURACION_DIESEL_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const MotorDiesel: React.FC = () => (
  <Short
    carpeta="diesel"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.gasolina, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.gasolina, hasta: T.truco, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Compresión", desde: T.truco, hasta: T.inyector, render: (t0) => <Compresion t0={t0} /> },
      { nombre: "Inyección", desde: T.inyector, hasta: T.gasolina2, render: (t0) => <Inyeccion t0={t0} /> },
      { nombre: "Gasolina", desde: T.gasolina2, hasta: T.frio, render: (t0) => <Gasolina t0={t0} /> },
      { nombre: "Precalentamiento", desde: T.frio, hasta: T.asi, render: (t0) => <Frio t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Encendido por compresión", T.enciende, T.gasolina2, C.yellow],
      ["Bujías de precalentamiento", T.precalentamiento, T.asi, C.white],
    ]}
    tics={[0.6, T.grados, T.enciende, T.explotaria]}
  />
);
