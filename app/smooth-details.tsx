"use client";
import {useRef,useState,useEffect,ReactNode} from 'react';
import {flushSync} from 'react-dom';

export default function SmoothDetails({className='',children}:{className?:string;children:ReactNode}){
  const [open,setOpen]=useState(false);const ref=useRef<HTMLDetailsElement>(null);const animation=useRef<Animation|null>(null);const desired=useRef(false);const revision=useRef(0);
  useEffect(()=>()=>{revision.current++;animation.current?.cancel()},[]);
  function toggle(e:React.MouseEvent<HTMLDetailsElement>){
    const el=ref.current!;const summary=el.querySelector('summary');
    if(!summary?.contains(e.target as Node))return;
    e.preventDefault();const ticket=++revision.current;const from=el.getBoundingClientRect().height;
    animation.current?.cancel();desired.current=!desired.current;
    if(!el.animate||window.matchMedia('(prefers-reduced-motion: reduce)').matches){setOpen(desired.current);return}
    if(desired.current)flushSync(()=>setOpen(true));
    const styles=getComputedStyle(el);
    const padding=['paddingTop','paddingBottom','borderTopWidth','borderBottomWidth'].reduce((sum,key)=>sum+(parseFloat(styles[key as keyof CSSStyleDeclaration] as string)||0),0);
    const to=desired.current?el.getBoundingClientRect().height:summary.getBoundingClientRect().height+padding;
    const run=el.animate([{height:from+'px'},{height:to+'px'}],{duration:340,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});animation.current=run;
    void run.finished.then(()=>{if(revision.current!==ticket)return;flushSync(()=>setOpen(desired.current));run.cancel();animation.current=null}).catch(()=>{});
  }
  return <details ref={ref} open={open} className={'smooth-details '+className} onClick={toggle}>{children}</details>;
}
