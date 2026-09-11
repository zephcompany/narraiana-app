export type Criterion = 'format'|'depth'|'position'|'axis';
export type Analysis = Record<Criterion,string>;
export type Option = {id:string;label:string;description:string;image?:string;crop?:[number,number,number,number];diagram?:string};
export const CRITERIA:{id:Criterion;title:string;hint:string;options:Option[]}[]=[
{id:'format',title:'Formato dos olhos',hint:'Observe a relação entre a altura, a largura e a posição da íris.',options:[
{id:'round',label:'Arredondados ou grandes',description:'A altura se aproxima da largura. A esclera pode ficar visível abaixo da íris.',image:'formats-b.png',crop:[364,68,328,125]},
{id:'narrow',label:'Estreitos ou pequenos',description:'A altura é menor em relação à largura e a pálpebra superior cobre parte da íris.',image:'formats-b.png',crop:[364,486,328,125]},
{id:'almond',label:'Amendoados',description:'A íris toca as pálpebras superior e inferior. O contorno lembra uma amêndoa.',image:'formats-b.png',crop:[364,903,328,125]},
{id:'monolid',label:'Asiáticos / pálpebra única',description:'Observe a dobra da pálpebra, que pode ser pouco aparente. Avalie a anatomia individual.',image:'formats-b.png',crop:[329,1312,328,125]}]},
{id:'depth',title:'Profundidade',hint:'Compare a projeção dos olhos com a região das sobrancelhas em uma foto de perfil.',options:[
{id:'normal',label:'Normais',description:'Os olhos têm uma projeção equilibrada em relação à região das sobrancelhas.',image:'depth.png',crop:[305,372,389,209]},
{id:'prominent',label:'Proeminentes',description:'Os olhos têm maior projeção para a frente. Registre a característica visual.',image:'depth.png',crop:[448,937,190,142]},
{id:'deep',label:'Profundos',description:'Os olhos parecem mais recuados em relação às sobrancelhas; a pálpebra móvel pode ficar menos visível.',image:'depth.png',crop:[438,1086,254,210]}]},
{id:'position',title:'Posicionamento',hint:'Compare o espaço entre os olhos com a largura de um olho.',options:[
{id:'balanced',label:'Harmonioso',description:'A distância entre os olhos é aproximadamente igual à largura de um olho.',image:'position.png',crop:[323,417,371,140]},
{id:'close',label:'Próximo',description:'A distância entre os olhos é menor que a largura de um olho.',image:'position.png',crop:[368,826,326,124]},
{id:'wide',label:'Afastado',description:'A distância entre os olhos é maior que a largura de um olho.',image:'position.png',crop:[344,1239,350,133]}]},
{id:'axis',title:'Alinhamento / eixo',hint:'Trace uma linha entre os cantos interno e externo. Avalie cada olho e anote diferenças.',options:[
{id:'horizontal',label:'Horizontal',description:'O canto externo está aproximadamente na mesma altura do canto interno.',diagram:'horizontal'},
{id:'ascending',label:'Ascendente',description:'O canto externo está acima do canto interno.',diagram:'ascending'},
{id:'descending',label:'Descendente',description:'O canto externo está abaixo do canto interno.',diagram:'descending'}]}
];
export type Mapping={id:string;name:string;purpose:string;matches:Partial<Analysis>;lengths:number[]};
export const MAPPINGS:Mapping[]=[
{id:'gatinho',name:'Gatinho',purpose:'Alongar e afastar visualmente o olhar.',matches:{format:'round',depth:'prominent',position:'close',axis:'ascending'},lengths:[7,8,9,10,11,12,11]},
{id:'elegance',name:'Elegance',purpose:'Abrir o olhar e valorizar a elevação do canto externo.',matches:{format:'narrow',depth:'deep',position:'wide',axis:'descending'},lengths:[7,8,9,10,12,11,10]},
{id:'boneca',name:'Boneca',purpose:'Valorizar o centro e a abertura do olhar.',matches:{format:'narrow',depth:'deep',position:'wide',axis:'descending'},lengths:[7,8,10,12,10,9,8]},
{id:'natural-elevacao',name:'Natural de elevação',purpose:'Abrir o olhar com uma transição suave de comprimentos.',matches:{format:'narrow',position:'wide',axis:'descending'},lengths:[7,8,9,10,11,10,9]},
{id:'fox',name:'Efeito Fox',purpose:'Alongar o olhar e suavizar visualmente a elevação do canto externo.',matches:{format:'round',depth:'deep',position:'close',axis:'ascending'},lengths:[6,7,8,9,10,12,11]},
{id:'natural-alongamento',name:'Natural de alongamento',purpose:'Alongar e afastar visualmente o olhar, com leveza.',matches:{format:'round',depth:'prominent',position:'close',axis:'ascending'},lengths:[6,7,8,9,10,11,10]},
{id:'delineador',name:'Efeito Delineador',purpose:'Criar uma linha alongada com destaque no canto externo.',matches:{format:'round',depth:'prominent',position:'close',axis:'ascending'},lengths:[5,6,7,8,9,10,9]}
];
export function labelFor(key:Criterion,value:string){return CRITERIA.find(c=>c.id===key)?.options.find(o=>o.id===value)?.label||'Não informado'}
export function rankMappings(a:Analysis){return MAPPINGS.map(m=>({...m,reasons:(Object.keys(m.matches) as Criterion[]).filter(k=>m.matches[k]===a[k]),score:(Object.keys(m.matches) as Criterion[]).filter(k=>m.matches[k]===a[k]).length})).sort((a,b)=>b.score-a.score)}
export function completeAnalysis(a:Analysis){return CRITERIA.every(c=>c.options.some(o=>o.id===a[c.id]))}
export type Layer={id:string;kind:'lash'|'text'|'stroke';x:number;y:number;width:number;height:number;rotation:number;opacity:number;flip:boolean;src?:string;mapping?:string;text?:string;color:string;points?:{x:number;y:number}[];strokeWidth?:number};
export type Project={id:string;client:string;professional:string;phone:string;date:string;photoId:string;photoWidth:number;photoHeight:number;analysis:Analysis;mapping:string;technique:string;curl:string;diameter:string;direction:string;numbering:string;notes:string;naturalRight:string;naturalLeft:string;layers:Layer[];stage:number;updatedAt?:string};
export function newProject():Project{return {id:crypto.randomUUID(),client:'',professional:'',phone:'',date:new Date().toLocaleDateString('en-CA'),photoId:'',photoWidth:1000,photoHeight:1200,analysis:{format:'',depth:'',position:'',axis:''},mapping:'',technique:'',curl:'',diameter:'',direction:'',numbering:'',notes:'',naturalRight:'',naturalLeft:'',layers:[],stage:0}}

export const MAPPING_RATIOS:Record<string,[number,number]>={gatinho:[299/735,260/645],elegance:[299/735,272/638],boneca:[299/735,285/629],'natural-elevacao':[299/735,299/621],fox:[299/734,236/645],'natural-alongamento':[298/426,324/621],delineador:[108/373,162/567]};
