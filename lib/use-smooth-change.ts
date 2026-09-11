"use client";
import {useEffect,useRef} from 'react';
import {flushSync} from 'react-dom';

/** Animate navigation only; direct editing and data entry stay immediate. */
export function useSmoothChange(){
  const sequence=useRef(0);const animation=useRef<Animation|null>(null);
  useEffect(()=>()=>{sequence.current++;animation.current?.cancel()},[]);
  return (commit:()=>void,selector:string)=>{
    const ticket=++sequence.current;animation.current?.cancel();
    const element=document.querySelector<HTMLElement>(selector);
    if(!element?.animate||window.matchMedia('(prefers-reduced-motion: reduce)').matches){commit();return}
    const leaving=element.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-5px)'}],{duration:110,easing:'ease-out',fill:'both'});
    animation.current=leaving;
    void leaving.finished.then(()=>{
      if(sequence.current!==ticket)return;
      leaving.cancel();flushSync(commit);
      const next=document.querySelector<HTMLElement>(selector);
      if(next){
        animation.current=next.animate([{opacity:0,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,easing:'cubic-bezier(.16,1,.3,1)'});
        void animation.current.finished.catch(()=>{});
      }
    }).catch(()=>{});
  };
}
