export type Size = {width:number;height:number};
export type Point = {x:number;y:number};
export function viewportGeometry(view:Size, image:Size, zoom:number, padding=24){
  const fit=Math.min(Math.max(1,view.width-padding*2)/image.width,Math.max(1,view.height-padding*2)/image.height);
  const width=image.width*fit*zoom/100,height=image.height*fit*zoom/100;
  const trackWidth=Math.max(view.width,width+padding*2),trackHeight=Math.max(view.height,height+padding*2);
  return {width,height,trackWidth,trackHeight,left:(trackWidth-width)/2,top:(trackHeight-height)/2};
}
export function anchoredScroll(old:ReturnType<typeof viewportGeometry>,next:ReturnType<typeof viewportGeometry>,scroll:Point,anchor:Point){
  return {x:(scroll.x+anchor.x-old.left)/old.width*next.width+next.left-anchor.x,y:(scroll.y+anchor.y-old.top)/old.height*next.height+next.top-anchor.y};
}
export function zoomFrame(view:Size,image:Size,start:number,target:number,progress:number,scroll:Point,anchor:Point,focus?:Point){
  const t=1-Math.pow(1-Math.max(0,Math.min(1,progress)),3),zoom=start+(target-start)*t;
  const old=viewportGeometry(view,image,start),next=viewportGeometry(view,image,zoom);
  const position=anchoredScroll(old,next,scroll,anchor);
  if(focus){
    const end=viewportGeometry(view,image,target),base=anchoredScroll(old,end,scroll,anchor);
    position.x+=(end.left+end.width*focus.x-view.width/2-base.x)*t;
    position.y+=(end.top+end.height*focus.y-view.height/2-base.y)*t;
  }
  return {zoom,scroll:position};
}
export function resizeLayer(o:{x:number;y:number;width:number;height:number;rotation:number},start:Point,p:Point,corner:string,free=false){
  const a=o.rotation*Math.PI/180,c=Math.cos(a),s=Math.sin(a),sx=corner.includes('e')?1:-1,sy=corner.includes('s')?1:-1;
  const dx=(p.x-start.x)*c+(p.y-start.y)*s,dy=-(p.x-start.x)*s+(p.y-start.y)*c;
  let width=Math.max(30,Math.min(1600,o.width+dx*sx)),height=Math.max(15,Math.min(800,o.height+dy*sy));
  if(!free){const factor=Math.abs(dx/o.width)>Math.abs(dy/o.height)?width/o.width:height/o.height;const limited=Math.max(30/o.width,15/o.height,Math.min(1600/o.width,800/o.height,factor));width=o.width*limited;height=o.height*limited;}
  const cx=(width-o.width)*sx/2,cy=(height-o.height)*sy/2;
  return {width,height,x:o.x+cx*c-cy*s,y:o.y+cx*s+cy*c};
}
