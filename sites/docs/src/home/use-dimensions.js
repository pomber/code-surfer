export default function useDimensions() {
  const [vw, vh] = useWindowDimensions();

  if (!vw) return null;

  const p = 1000;

  // screen
  const sratio = 16 / 9;
  const sz = 300;
  const srw = vw * 0.6;
  const srh = srw / sratio;
  const ss = (p + sz) / p;
  const sw = ss * srw;
  const sh = sw / sratio;
  const sx = -sw / 2;
  const sy = -sh;

  // header
  const hz = 300;
  const hs = (p + hz) / p;
  const hrw = srw;
  const hrh = hrw / 5;
  const hw = hrw * hs;
  const hh = hrh * hs;
  const hx = -hw / 2;
  const hy = -sh - hh;

  // origin
  const ox = vw / 2;
  const oy = (srh * 6) / 5;

  // developer
  const dz = 100;
  const drw = srw / 10;
  const drh = drw;
  const ds = (p + dz) / p;
  const dw = ds * drw;
  const dh = dw;
  const dx = dw * 2.5;
  const dy = sh / 20;

  // podium
  const pz = 80;
  const prw = drw;
  const ps = (p + pz) / p;
  const pw = ps * prw;
  const ph = (pw * 3) / 2;
  const px = (dx * ps) / ds;
  const py = dy + (drh - 1) * ps;

  // banners
  const bz = 260;
  const brw = vw * 0.1;
  const bs = (p + bz) / p;
  const bw = brw * bs;
  const bh = bw * 3;
  const brx = 0.45 * vw;
  const bx = brx * bs;
  const by = (-bh * 4) / 5;

  // floor
  const fw = vw * 2;
  const fh = sz;
  const fx = -fw / 2;
  const fy = py + ph - fh / 2;
  const fz = sz / 2;
  const fax = 90;

  // content
  const cw = vw;
  const cx = -ox;
  const cy = py + ph;

  return {
    perspective: p,
    origin: {
      x: ox,
      y: oy
    },
    screen: {
      x: sx,
      y: sy,
      z: -sz,
      width: sw,
      height: sh
    },
    header: {
      x: hx,
      y: hy,
      z: -hz,
      width: hw,
      height: hh
    },
    dev: {
      x: dx,
      y: dy,
      z: -dz,
      width: dw,
      height: dh
    },
    podium: {
      x: px,
      y: py,
      z: -pz,
      width: pw,
      height: ph
    },
    banner: {
      rightx: bx - bw,
      leftx: -bx,
      y: by,
      z: -bz,
      rightangle: -15,
      leftangle: 15,
      width: bw,
      height: bh
    },
    floor: {
      x: fx,
      y: fy,
      z: -fz,
      width: fw,
      height: fh,
      xangle: fax
    },
    content: {
      x: cx,
      y: cy,
      z: 0,
      width: cw,
      height: null
    }
  };
}

function useWindowDimensions() {
  if (typeof window === "undefined") return [];
  // TODO handle resize
  return [window.innerWidth, window.innerHeight];
}
