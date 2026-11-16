import narracion from "../../guion/bateria/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Caida,
  Cierre,
  Gancho,
  Limita,
  Pico,
  Quimica,
  Solucion,
  T,
} from "./Escenas";

export const DURACION_BATERIA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const BateriaLenta: React.FC = () => (
  <Short
    carpeta="bateria"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.tras, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.tras, hasta: T.cuando, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Pico de corriente", desde: T.cuando, hasta: T.pero, render: (t0) => <Pico t0={t0} /> },
      { nombre: "Química", desde: T.pero, hasta: T.entonces, render: (t0) => <Quimica t0={t0} /> },
      { nombre: "Caída de voltaje", desde: T.entonces, hasta: T.para, render: (t0) => <Caida t0={t0} /> },
      { nombre: "Limita", desde: T.para, hasta: T.la, render: (t0) => <Limita t0={t0} /> },
      { nombre: "Solución", desde: T.la, hasta: T.porEso, render: (t0) => <Solucion t0={t0} /> },
      { nombre: "Cierre", desde: T.porEso, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Resistencia interna", T.resistencia, T.entonces, C.orange],
      ["Caída de voltaje pico", T.cae, T.para, C.red],
      ["Limitación de rendimiento", T.limitan, T.la, C.white],
    ]}
    tics={[0.68, T.pide, T.cae, T.apaga, T.limitan, T.cambiar]}
  />
);
