import narracion from "../../guion/buho/narracion.json";
import {
  duracionShort,
  palabrasDe,
  Short,
  SIN_LOGO,
} from "../components/Short";
import { C } from "../theme";
import {
  Bordes,
  Bucle,
  Cierre,
  Gancho,
  Ingenieros,
  Remolinos,
  Terciopelo,
  T,
} from "./Escenas";

export const DURACION_BUHO_S = duracionShort(T.fin, SIN_LOGO);

// Retención (estilo.md §10): sin logo, final que empalma con el inicio, subtítulos.
export const BuhoSilencio: React.FC = () => (
  <Short
    carpeta="buho"
    cola={SIN_LOGO}
    palabras={palabrasDe(narracion)}
    fin={T.fin}
    escenas={[
      { nombre: "Gancho", desde: 0, hasta: T.paloma, render: (t0) => <Gancho t0={t0} /> },
      { nombre: "Bucle", desde: T.paloma, hasta: T.ruido, render: (t0) => <Bucle t0={t0} /> },
      { nombre: "Remolinos", desde: T.ruido, hasta: T.trucos, render: (t0) => <Remolinos t0={t0} /> },
      { nombre: "Bordes", desde: T.trucos, hasta: T.aterciopeladas, render: (t0) => <Bordes t0={t0} /> },
      { nombre: "Terciopelo", desde: T.aterciopeladas, hasta: T.ingenieros, render: (t0) => <Terciopelo t0={t0} /> },
      { nombre: "Biomimética", desde: T.ingenieros, hasta: T.asi, render: (t0) => <Ingenieros t0={t0} /> },
      { nombre: "Cierre", desde: T.asi, hasta: T.fin, render: (t0) => <Cierre t0={t0} /> },
    ]}
    etiquetas={[
      ["Turbulencia", T.arremolina, T.trucos, C.red],
      ["Bordes dentados", T.peine, T.aterciopeladas, C.yellow],
      ["Biomimética", T.ventiladores, T.asi, C.cyan],
    ]}
    tics={[0.7, T.peine, T.ventiladores]}
  />
);
