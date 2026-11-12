import narracion from "../../guion/anestesia/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bucle,
  Cables,
  Canales,
  Cierre,
  Empujon,
  Finos,
  Gancho,
  Gruesos,
  Resumen,
  T,
} from "./Escenas";

export const DURACION_ANESTESIA_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const AnestesiaDentista: React.FC = () => (
  <Short
    carpeta="anestesia"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho: muela", desde: 0, hasta: T.pero, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.pero, hasta: T.de, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Cables", desde: T.de, hasta: T.tacto, render: (t0) => <Cables t0={t0} /> },
      { nombre: "Gruesos", desde: T.tacto, hasta: T.anestesia, render: (t0) => <Gruesos t0={t0} /> },
      { nombre: "Canales", desde: T.anestesia, hasta: T.finos, render: (t0) => <Canales t0={t0} /> },
      { nombre: "Finos", desde: T.finos, hasta: T.gruesosAg, render: (t0) => <Finos t0={t0} /> },
      { nombre: "Empujón", desde: T.gruesosAg, hasta: T.porEso, render: (t0) => <Empujon t0={t0} /> },
      { nombre: "Resumen", desde: T.porEso, hasta: T.porque, render: (t0) => <Resumen t0={t0} /> },
      { nombre: "Cierre", desde: T.porque, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Fibras del dolor", T.dolor, T.tacto, C.red],
      ["Fibras con mielina", T.mielina, T.anestesia, C.white],
      ["Canales de sodio", T.canales, T.finos, C.yellow],
      ["Bloqueo selectivo", T.apagan, T.gruesosAg, C.cyan],
    ]}
    tics={[0.7, T.dolor, T.mielina, T.senal, T.apagan, T.presion]}
  />
);
