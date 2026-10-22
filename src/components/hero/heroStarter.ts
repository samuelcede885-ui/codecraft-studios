import { HERO_SPEED, heroStages } from "@/data/heroStages";

declare global {
  interface Window {
    /** El script en línea ya arrancó el video del hero (antes de que cargue React). */
    __faryHeroStarted?: boolean;
    /** HeroExperience ya tomó el control de la sincronía. */
    __faryHeroReact?: boolean;
  }
}

/**
 * Script en línea que va dentro del HTML del hero. Arranca el video justo al terminar la intro
 * (o de inmediato si no hay intro) sin esperar al JavaScript de la página, que en conexiones lentas
 * llega segundos después. Hasta que HeroExperience toma el relevo, mantiene los textos sincronizados
 * leyendo `currentTime` del video (la misma regla de siempre: nunca temporizadores propios).
 * Con movimiento reducido no hace nada: el hero empieza en pausa.
 */
export function heroStarterScript() {
  const stages = JSON.stringify(heroStages.map((s) => [s.start, s.end]));
  return `(function(){
var d=document,v=d.querySelector(".hero-video");
if(!v||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
var S=${stages},sp=${HERO_SPEED};
var lead=d.querySelectorAll(".zone--lead .hero-panel"),aside=d.querySelectorAll(".zone--aside .hero-panel"),tags=d.querySelectorAll(".hero-tag");
function st(i,k){return i===k?"active":i<k?"past":"next"}
function at(t){for(var i=0;i<S.length;i++)if(t>=S[i][0]&&t<S[i][1])return i;return S.length-1}
function sync(){if(window.__faryHeroReact)return;var k=at(v.currentTime);
for(var i=0;i<lead.length;i++)lead[i].setAttribute("data-state",st(i,k));
for(i=0;i<aside.length;i++)aside[i].setAttribute("data-state",st(i,k));
for(i=0;i<tags.length;i++)tags[i].setAttribute("data-state",st(i+1,k));
requestAnimationFrame(sync)}
function go(){window.__faryHeroStarted=true;v.defaultPlaybackRate=sp;v.playbackRate=sp;var p=v.play();if(p&&p.catch)p.catch(function(){});sync()}
var seen=d.documentElement.classList.contains("intro-seen");
var wait=seen?0:Math.max(0,2200-(performance.now()-(window.__faryIntroT0||0)));
setTimeout(go,wait)})();`;
}
