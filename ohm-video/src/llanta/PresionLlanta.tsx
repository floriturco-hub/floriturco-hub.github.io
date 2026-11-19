import { duracionShort, Short } from "../components/Short";
import { C } from "../theme";
import { Cierre, Digital, Fria, Gancho, Lapiz, Psi, T } from "./Escenas";

export const DURACION_LLANTA_S = duracionShort(T.fin);

export const PresionLlanta: React.FC = () => (
  <Short
    carpeta="llanta"
    fin={T.fin}
    escenas={[
      {
        nombre: "Gancho: aire",
        desde: 0,
        hasta: T.psi,
        render: (t0) => <Gancho t0={t0} />,
      },
      {
        nombre: "PSI",
        desde: T.psi,
        hasta: T.mide,
        render: (t0) => <Psi t0={t0} />,
      },
      {
        nombre: "Lápiz",
        desde: T.mide,
        hasta: T.digital,
        render: (t0) => <Lapiz t0={t0} />,
      },
      {
        nombre: "Digital",
        desde: T.digital,
        hasta: T.fria,
        render: (t0) => <Digital t0={t0} />,
      },
      {
        nombre: "Fría",
        desde: T.fria,
        hasta: T.libras,
        render: (t0) => <Fria t0={t0} />,
      },
      {
        nombre: "Cierre",
        desde: T.libras,
        hasta: T.fin,
        render: (t0) => <Cierre t0={t0} />,
      },
    ]}
    etiquetas={[
      ["¡Tu auto se apoya en aire!", 0, T.psi, C.yellow, 54],
      ["PSI: libras por pulgada²", T.psi, T.pulgada, C.white],
      ["32 libras en cada pulgada²", T.pulgada, T.mide, C.cyan],
      ["Pistón contra un resorte", T.piston, T.digital, C.white],
      ["Membrana de silicio", T.membrana, T.dobla, C.white],
      ["Se dobla: cambia la resistencia", T.dobla, T.fria, C.orange, 40],
      ["Mide con la llanta fría", T.fria, T.libras, C.cyan],
      ["Aire que carga tu auto", T.libras, T.fin + 0.5, C.yellow],
    ]}
    tics={[1.0, T.psi, T.varilla, T.chip, T.sube]}
  />
);
