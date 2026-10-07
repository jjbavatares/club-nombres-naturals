'use strict';
(function(root){
  const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[rand(0,a.length-1)];
  const shuffle=a=>{const out=a.slice();for(let i=out.length-1;i>0;i--){const j=rand(0,i);[out[i],out[j]]=[out[j],out[i]];}return out;};
  const fmt=n=>new Intl.NumberFormat('ca-ES').format(n);
  const levels={inicial:{max:50,digits:4},mitja:{max:150,digits:5},repte:{max:500,digits:6}};
  const definitions=[
    {id:'bingo',name:'Bingo',title:'La sala del bingo',desc:'Omple el cartró resolent les pistes. Nou cartró, nous nombres!',topic:'Càlcul mental i valor posicional',instructions:'Resol la pista i prem la casella amb el resultat. Cada encert marca una casella. Completa les nou per fer bingo.'},
    {id:'mercat',name:'Mercat',title:'El mercat del barri',desc:'Omple el cistell, calcula el total i comprova el canvi.',topic:'Operacions i problemes de compra',instructions:'Llegeix la llista de compra. Calcula el total i el canvi amb preus enters, sense cèntims. Les quantitats canvien a cada compra.'},
    {id:'domino',name:'Dòmino',title:'El taller del dòmino',desc:'Arrossega les fitxes i construeix una cadena d’operacions.',topic:'Càlcul i jerarquia d’operacions',instructions:'Calcula l’operació de l’extrem de la cadena i arrossega la fitxa que comença amb el resultat. També pots seleccionar-la i prémer la zona de col·locació.'},
    {id:'tresor',name:'Tresor',title:'L’illa del tresor',desc:'Explora sis indrets i reuneix les peces del mapa.',topic:'Ordenació, sèries i càlcul',instructions:'Explora els sis indrets del mapa. Tens dos intents per prova. Un indret assolit es tatxa en verd; si falles tots dos intents, queda en vermell. Només superes l’expedició si assoleixes tots sis indrets.'},
    {id:'misteri',name:'Nombre misteriós',title:'El laboratori secret',desc:'Investiga les pistes i descobreix el nombre amagat.',topic:'Valor posicional i raonament',instructions:'Les quatre pistes determinen un únic nombre de quatre xifres. Pots demanar una pista extra, que quedarà registrada a l’informe.'},
    {id:'cursa',name:'Cursa',title:'El circuit dels nombres',desc:'Avança pel circuit al teu ritme, sense compte enrere.',topic:'Càlcul, estimació i comparació',instructions:'Supera vuit reptes per arribar a la meta. No hi ha límit de temps: importa el raonament. El corredor avança quan encertes.'},
    {id:'construccio',name:'Construïm',title:'La fàbrica de nombres',desc:'Mou les xifres i fabrica el nombre que et demanen.',topic:'Valor posicional i ordenació',instructions:'Arrossega cada xifra a una casella o selecciona-la i prem una casella. Fes servir totes les xifres una sola vegada. El nombre no pot començar per zero.'},
    {id:'detectius',name:'Detectius',title:'L’agència dels errors',desc:'Troba el pas incorrecte i repara el càlcul.',topic:'Jerarquia d’operacions i revisió crítica',instructions:'Selecciona el primer pas incorrecte i escriu el resultat correcte de tota l’operació. Investiga cinc casos per tancar l’expedient.'}
  ];
  function arithmetic(level='mitja',type){
    const max=levels[level].max;type=type??rand(0,5);let a=rand(12,max),b=rand(2,12),c=rand(2,9);
    if(type===0)return {text:`${a} + ${b}`,answer:a+b,hint:'Suma primer les unitats i després les desenes.'};
    if(type===1)return {text:`${a+b} − ${b}`,answer:a,hint:'Pots comprovar la resta amb una suma.'};
    if(type===2)return {text:`${b} · ${c}`,answer:b*c,hint:'Multiplicar és sumar una mateixa quantitat diverses vegades.'};
    if(type===3)return {text:`${b*c} : ${b}`,answer:c,hint:'Busca quin nombre multiplicat pel divisor dona el dividend.'};
    if(type===4)return {text:`${a} + ${b} · ${c}`,answer:a+b*c,hint:'Fes primer la multiplicació i després la suma.'};
    return {text:`(${b} + ${c}) · ${rand(2,5)}`,get answer(){return Number(this.text.match(/· (\d+)/)[1])*(b+c)},hint:'Resol primer el parèntesi.'};
  }
  function mixed(level,i){
    if(i%4===0){const a=rand(100,levels[level].max*100),b=rand(15,75);return {text:`Completa la sèrie: ${fmt(a)}, ${fmt(a+b)}, ${fmt(a+2*b)}, …`,answer:a+3*b,hint:`Entre termes consecutius hi ha la mateixa diferència. Resta el segon menys el primer.`};}
    if(i%4===1){let n=shuffle([rand(100,999),rand(1000,9999),rand(10000,99999)]);return {text:`Quin és el nombre més ${i%2?'gran':'petit'}: ${n.map(fmt).join(', ')}?`,answer:Math.max(...n),hint:'Compara primer quantes xifres té cada nombre.'};}
    if(i%4===2){let a=rand(10,99),b=rand(2,9);return {text:`Hi ha ${a} caixes amb ${b} llibres cadascuna. Quants llibres hi ha?`,answer:a*b,hint:'Multiplica les caixes pels llibres de cada caixa.'};}
    return arithmetic(level);
  }
  const productNames=['Pomes','Llibretes','Llapis','Entrepans','Suc','Galetes','Plàtans','Retoladors'];
  const productIcons=['poma','llibreta','llapis','entrepa','suc','galetes','platan','retolador'];
  function market(level){const indexes=shuffle([0,1,2,3,4,5,6,7]).slice(0,4),products=indexes.map(i=>({name:productNames[i],icon:productIcons[i],price:rand(1,level==='inicial'?8:level==='mitja'?18:40),qty:rand(1,level==='repte'?7:4)}));const total=products.reduce((a,p)=>a+p.qty*p.price,0);const paid=Math.ceil(total/10)*10+rand(1,4)*10;return {products,total,paid,change:paid-total};}
  function permutations(a){if(a.length===1)return [a];return a.flatMap((v,i)=>permutations(a.filter((_,j)=>j!==i)).map(p=>[v,...p]));}
  function construction(level){let digits=shuffle([0,1,2,3,4,5,6,7,8,9]).slice(0,levels[level].digits);if(!digits.some(d=>d%2===0))digits[0]=2;const mode=pick(['max','min','even']),valid=permutations(digits).filter(d=>d[0]!==0&&(mode!=='even'||d[d.length-1]%2===0)).map(d=>Number(d.join('')));const answer=mode==='max'?Math.max(...valid):Math.min(...valid);return {digits,slots:digits.map(()=>null),mode,answer,text:mode==='max'?'Construeix el nombre més gran possible.':mode==='min'?'Construeix el nombre més petit possible.':'Construeix el nombre parell més petit possible.',hint:'Compara les xifres començant per l’esquerra. El zero no pot anar al davant. Si ha de ser parell, reserva una xifra parella per al final.'};}
  function mystery(level='mitja'){const d=[rand(1,9),rand(0,9),rand(0,9),rand(0,9)];let clues=level==='inicial'?[`La xifra dels milers és ${d[0]+2} − 2.`,`La xifra de les centenes és ${d[1]+3} − 3.`,`La xifra de les desenes és ${d[2]+1} − 1.`,`La xifra de les unitats és ${d[3]+4} − 4.`]:level==='repte'?[`La xifra dels milers és (${d[0]+4} − 4) · 2 : 2.`,`La xifra de les centenes és el residu de dividir ${d[1]+70} entre 10.`,`La suma de les xifres dels milers i de les desenes és ${d[0]+d[2]}.`,`La suma de les quatre xifres és ${d.reduce((a,b)=>a+b,0)}.`]:[`La xifra dels milers és el resultat de ${d[0]+7} − 7.`,`La xifra de les centenes és el residu de dividir ${d[1]+20} entre 10.`,`La xifra de les desenes és ${d[2]+3} − 3.`,`La xifra de les unitats és la meitat de ${d[3]*2}.`];return {answer:Number(d.join('')),clues,hint:`Resol les pistes en ordre i col·loca les xifres: milers, centenes, desenes i unitats. El residu és el que sobra en una divisió.`};}
  function detective(level){let a=rand(5,levels[level].max),b=rand(2,9),c=rand(2,9),kind=rand(0,2);if(kind===0)return {text:`${a} + ${b} · ${c}`,lines:[`${a} + ${b} · ${c}`,`${a+b} · ${c}`,`${(a+b)*c}`],bad:1,answer:a+b*c,hint:'Sense parèntesis, les multiplicacions es fan abans que les sumes.'};if(kind===1)return {text:`(${a} + ${b}) · ${c}`,lines:[`(${a} + ${b}) · ${c}`,`${a+b} · ${c}`,`${(a+b)*c+rand(1,9)}`],bad:2,answer:(a+b)*c,hint:'El parèntesi està ben resolt. Comprova el producte del segon pas.'};return {text:`${a+b*c} − ${b} · ${c}`,lines:[`${a+b*c} − ${b} · ${c}`,`${a+b*c} − ${b*c+1}`,`${a-1}`],bad:1,answer:a,hint:'Comprova la multiplicació abans de fer la resta.'};}
  function create(id,level){let r={id,level,index:0,done:false,hintShown:false,feedback:'',feedbackType:'',touched:false};
    if(id==='bingo'){let q=[],seen=new Set();while(q.length<9){let x=arithmetic(level);if(!seen.has(x.answer)){q.push({...x,answer:x.answer});seen.add(x.answer);}}r.questions=shuffle(q);r.cells=shuffle(q.map(x=>x.answer));r.marked=[];}
    if(id==='mercat')r.questions=Array.from({length:5},()=>market(level));
    if(id==='domino'){const values=shuffle(Array.from({length:level==='inicial'?35:70},(_,i)=>i+(level==='inicial'?5:15))).slice(0,7);const expression=n=>{const k=rand(2,9);return level==='inicial'?`${n+k} − ${k}`:level==='mitja'?`${n*2} : 2`:`${n} + ${k} · 3 − ${k*3}`;};r.start=expression(values[1]);r.expected=values[1];r.tiles=shuffle(values.slice(1).map((v,i)=>({key:i,left:v,operation:i===5?'META':expression(values[i+2]),next:values[i+2]})));r.chain=[];r.selected=null;}
    if(id==='tresor'||id==='cursa')r.questions=Array.from({length:id==='tresor'?6:8},(_,i)=>({...mixed(level,i)}));
    if(id==='tresor'){r.outcomes=Array(6).fill('pendent');r.failures=Array(6).fill(0);r.passed=false;}
    if(id==='misteri')r.questions=Array.from({length:5},()=>mystery(level));
    if(id==='construccio')r.questions=Array.from({length:5},()=>construction(level));
    if(id==='detectius'){r.questions=Array.from({length:5},()=>detective(level));r.selected=null;}
    return r;
  }
  root.NaturalEngine={rand,pick,shuffle,fmt,definitions,levels,arithmetic,mixed,market,construction,mystery,detective,create};
})(typeof window!=='undefined'?window:globalThis);
