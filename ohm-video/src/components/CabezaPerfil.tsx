import { AbsoluteFill } from "remotion";
import { C, H, W } from "../theme";

// Cabeza de perfil detallada (mirando a la derecha) para los próximos vídeos.
// No sustituye a Cabeza.tsx: el vídeo de tinnitus ya grabado conserva esa versión.
const METAL = "#8C88A8";

const PERFIL =
  "M 420 1560 L 430 1340 C 330 1290 290 1120 300 980 C 310 830 380 700 500 670 C 600 645 720 660 800 730 C 840 765 858 820 856 870 C 857 880 862 892 866 902 C 868 920 878 960 900 985 C 912 995 910 1008 896 1014 C 884 1018 878 1026 880 1032 C 884 1040 892 1048 884 1056 C 877 1064 870 1066 866 1066 C 858 1068 856 1078 866 1082 C 880 1100 874 1130 852 1150 C 830 1175 800 1200 760 1225 L 735 1250 C 728 1300 722 1400 716 1560 Z";

const CABELLO =
  "M 300 980 C 310 830 380 700 500 670 C 600 645 720 660 800 730 C 790 750 770 760 740 760 C 680 740 600 760 520 800 C 450 840 400 900 390 980 C 360 990 320 1000 300 980 Z";

const OREJA =
  "M 600 890 C 630 880 650 905 648 935 C 646 965 630 980 610 982 C 596 984 592 972 602 960 C 612 950 614 935 606 928 C 600 922 592 920 590 912 Z";

export const CabezaPerfil: React.FC<{ readonly x?: number; readonly y?: number; readonly s?: number }> = ({ x = 0, y = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={PERFIL} fill="#1A1636" stroke={METAL} strokeWidth={8} strokeLinejoin="round" />
    <path d={CABELLO} fill="#0B091D" opacity={0.6} />
    <path d={OREJA} fill="none" stroke={METAL} strokeWidth={6} strokeLinejoin="round" />
    <path d="M 606 940 Q 620 948 616 962" fill="none" stroke={METAL} strokeWidth={4} strokeLinecap="round" opacity={0.6} />
    <path d="M 776 856 Q 800 844 826 854" fill="none" stroke={METAL} strokeWidth={6} strokeLinecap="round" />
    <path d="M 778 884 Q 800 868 822 880 Q 800 892 778 884 Z" fill={C.bgDeep} />
    <circle cx={806} cy={880} r={4} fill={C.white} opacity={0.8} />
    <path d="M 846 1000 Q 830 1040 848 1082" fill="none" stroke={METAL} strokeWidth={4} strokeLinecap="round" opacity={0.4} />
  </g>
);

export const CabezaPerfilPreview: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <svg width={W} height={H}>
      <CabezaPerfil />
    </svg>
  </AbsoluteFill>
);
