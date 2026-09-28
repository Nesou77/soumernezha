/**
 * Keeps the visitor's reading position when switching language.
 *
 * Switching is a full page load (the root layout changes with the locale), so
 * the position is recorded just before leaving and re-applied as soon as the
 * new page is parsed. Instead of a raw pixel offset (French text is longer
 * than English, so pixels drift), it records WHICH block is being read and
 * how far into it: both languages render the same blocks in the same order.
 */

const KEY = "ns-lang-anchor";
/** Page blocks used as anchors, in document order (identical in every language). */
const SELECTOR = "main section, main article > header, main article > figure, main article > nav, footer";
/** Reference line: a quarter down the viewport, roughly where the eye reads. */
const REF = 0.25;

interface Anchor {
  path: string;
  index: number;
  ratio: number;
  fraction: number;
}

/** Call right before navigating to `targetPath` in the other language. */
export function captureScrollAnchor(targetPath: string): void {
  try {
    if (window.scrollY < 4) {
      sessionStorage.removeItem(KEY);
      return;
    }
    const ref = window.innerHeight * REF;
    const blocks = Array.from(document.querySelectorAll(SELECTOR));
    let index = -1;
    blocks.forEach((el, i) => {
      if (el.getBoundingClientRect().top <= ref) index = i;
    });
    const rect = index >= 0 ? blocks[index].getBoundingClientRect() : null;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const anchor: Anchor = {
      path: targetPath,
      index,
      ratio: rect && rect.height > 0 ? (ref - rect.top) / rect.height : 0,
      fraction: max > 0 ? window.scrollY / max : 0,
    };
    sessionStorage.setItem(KEY, JSON.stringify(anchor));
  } catch {
    // Storage unavailable (private mode…): the switch still works, from the top.
  }
}

/**
 * Inline script rendered at the end of <body>: restores the position before
 * the first paint, then re-applies it while fonts and images settle, and
 * stops as soon as the visitor scrolls on their own.
 */
export const scrollRestoreScript = `(function(){try{
var raw=sessionStorage.getItem(${JSON.stringify(KEY)});if(!raw)return;
sessionStorage.removeItem(${JSON.stringify(KEY)});
var a=JSON.parse(raw);if(!a||a.path!==location.pathname)return;
var stop=false;function cancel(){stop=true;}
["wheel","touchstart","keydown","mousedown"].forEach(function(e){addEventListener(e,cancel,{once:true,passive:true});});
function apply(){if(stop)return;var y;var b=a.index>=0?document.querySelectorAll(${JSON.stringify(SELECTOR)})[a.index]:null;
if(b){var r=b.getBoundingClientRect();y=scrollY+r.top+a.ratio*r.height-innerHeight*${REF};}
else{y=a.fraction*(document.documentElement.scrollHeight-innerHeight);}
scrollTo({top:Math.max(0,y),behavior:"instant"});}
apply();requestAnimationFrame(apply);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(apply);
addEventListener("load",apply,{once:true});setTimeout(apply,450);setTimeout(apply,1200);
}catch(e){}})();`;
