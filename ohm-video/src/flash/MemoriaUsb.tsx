import narracion from "../../guion/flash/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Celdas,
  Cierre,
  Desgaste,
  Escribir,
  Gancho,
  Leer,
  SinLuz,
  T,
} from "./Escenas";

export const DURACION_FLASH_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const MemoriaUsb: React.FC = () => (
  <Short
    carpeta="flash"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.la, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.la, hasta: T.por, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Celdas", desde: T.por, hasta: T.para, render: (t0) => <Celdas t0={t0} /> },
      { nombre: "Escribir", desde: T.para, hasta: T.sin, render: (t0) => <Escribir t0={t0} /> },
      { nombre: "Sin electricidad", desde: T.sin, hasta: T.leer, render: (t0) => <SinLuz t0={t0} /> },
      { nombre: "Leer", desde: T.leer, hasta: T.pero, render: (t0) => <Leer t0={t0} /> },
      { nombre: "Desgaste", desde: T.pero, hasta: T.asi2, render: (t0) => <Desgaste t0={t0} /> },
      { nombre: "Cierre", desde: T.asi2, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Compuerta flotante", T.jaula, T.para, C.yellow],
      ["Efecto túnel", T.electrones + 1, T.sin, C.cyan],
      ["Memoria no volátil", T.asi, T.pero, C.white],
    ]}
    tics={[0.74, T.jaula, T.atrapados, T.asi, T.llena, T.copia]}
  />
);
