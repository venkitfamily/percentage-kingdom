const state=JSON.parse(localStorage.getItem("pctKingdom")||'{"done":{},"best":{},"route":null}');
if(!("route" in state)) state.route=null;
if(!state.questionHistory) state.questionHistory={};
let currentTopic=0,currentAge=0,questions=[],qIndex=0,correct=0,answered=false;
let learningRoute=state.route||null;
const $=id=>document.getElementById(id);
function save(){localStorage.setItem("pctKingdom",JSON.stringify(state));renderNav();updateCrown()}
function key(){return currentAge+"-"+currentTopic}
function completed(k){return !!state.done[k]}
function renderNav(){
 const nav=$("nav");nav.innerHTML="";
 topics.forEach((t,i)=>{let b=document.createElement("button");b.textContent=(completed(currentAge+"-"+i)?"💎 ":"🔒 ") +(i+1)+". "+t.name;b.className=i===currentTopic?"active":"";b.onclick=()=>openTopic(i);nav.appendChild(b)});
}
function updateCrown(){
 let count=0;for(let a=0;a<3;a++){let all=topics.every((_,i)=>state.done[a+"-"+i]);$("gem"+a).classList.toggle("earned",all);if(all)count++}
 let done=Object.keys(state.done).length;$("overall").style.width=(done/21*100)+"%";$("progressText").textContent=done+" of 21 milestones mastered · "+count+"/3 gemstones";
}
function openTopic(i){
 currentTopic=i;$("welcome").classList.add("hidden");$("lesson").classList.remove("hidden");renderNav();renderLesson();
}
function renderLesson(){
 let t=topics[currentTopic],done=completed(key()),el=$("lesson");
 el.innerHTML=`<span class="tag">TOPIC ${currentTopic+1} OF 7</span><h2>${t.name}</h2><p class="muted">Source focus: ${t.source}</p>
 <div class="levels">${learningRoute==='flexi'
 ? ageNames.map((n,i)=>`<button class="${i===currentAge?'active':''}" onclick="setAge(${i})">${['🟢','🔵','🟣'][i]} ${n} · Age ${[8,10,12][i]}</button>`).join('')
 : `<div class="callout"><b>🔒 Fixed Route · Age ${[8,10,12][currentAge]} — ${ageNames[currentAge]}</b><br><span class="small">Complete all seven topics at this age to unlock the next journey.</span></div>`}</div>
 <h3>1. Discover and understand</h3><div class="callout">${t.teach[currentAge][0]}</div>
 <h3>2. Learn it step by step</h3><p>${t.teach[currentAge][1]}</p><p>${t.teach[currentAge][2]}</p>
 <div class="diagram">${Array.from({length:10},(_,i)=>`<span class="unit ${i<5?'on':''}"></span>`).join('')}<span class="small">5 of 10 equal parts = 50%. The same proportion is 50 of 100 = 50%.</span></div>
 <h3>3. Remember the method</h3><ol class="steps">${t.method.map(s=>`<li>${s}</li>`).join('')}</ol>
 <section class="examples" aria-labelledby="examplesTitle">
  <h3 id="examplesTitle">4. Worked examples</h3>
  <p class="muted">Study these two examples first. Each step explains what we do and why.</p>
  <div id="workedExamples"></div>
  <button class="btn secondary" type="button" onclick="generateMoreExamples()">＋ Show me 2 more examples</button>
 </section>
 <div class="practice"><h3>5. Mastery challenge</h3><p>Answer 5 fresh questions. You need <b>5 out of 5 (100%)</b> to master this gate. If you miss one, practise a new round.</p><div id="quiz"></div></div>
 <p class="footer">${done?'💎 This topic is mastered. You can practise again to strengthen your skills.':'This gate is not yet mastered. Keep practising until you score 100%.'}</p>`;
 exampleBatch=0;renderWorkedExamples();updateStickyContext();startRound();
}
let exampleBatch=0;
function workedExamplePair(batch){
 const a=currentAge,t=currentTopic,shift=batch*2;
 const examples=[];
 const add=(title,steps,answer)=>examples.push({title,steps,answer});
 if(t===0){
  const banks=[[[25,50],[20,75],[10,40],[30,60],[15,80],[40,90]],[[25,50],[20,75],[10,40],[30,60],[15,80],[12.5,50]],[[12.5,37.5],[15,62.5],[22.5,75],[37.5,87.5],[6.25,56.25],[42.5,92.5]]];
  const vals=banks[a][(shift/2)%banks[a].length];
  const p=vals[0],n=vals[1];
  add(`Example ${shift+1}: What does ${p}% mean?`,[`“Percent” means “out of 100”.`,`Write ${p}% as ${p} out of 100.`,`So ${p}% = ${p}/100.`],`${p} out of 100`);
  add(`Example ${shift+2}: ${n} out of 100`,[`The whole is 100.`,`The selected part is ${n}.`,`Therefore, the percentage is ${n}%.`],`${n}%`);
 }else if(t===1){
  const sets=[[[1,2,50],[3,4,75],[2,5,40],[7,10,70]],[[3,8,37.5],[7,20,35],[9,25,36],[5,8,62.5]],[[7,16,43.75],[11,40,27.5],[13,50,26],[17,40,42.5]]][a];
  for(let j=0;j<2;j++){let [n,d,p]=sets[(shift+j)%sets.length];add(`Example ${shift+j+1}: Convert ${n}/${d} to a percentage`,[`Divide numerator by denominator: ${n} ÷ ${d} = ${(n/d).toFixed(4).replace(/0+$/,"").replace(/\\.$/,"")}.`,`Multiply by 100: ${(n/d)*100}%.`,`Therefore, ${n}/${d} = ${p}%.`],`${p}%`);}
 }else if(t===2){
  const banks=[[[25,80],[50,120],[10,240],[20,100],[25,200],[50,400]],[[15,600],[20,350],[30,400],[40,650],[12.5,800],[25,1200]],[[12.5,800],[37.5,640],[17.5,1200],[62.5,1600],[22.5,2400],[7.5,3200]]];
  const vals=banks[a];
  for(let j=0;j<2;j++){let [p,n]=vals[(shift+j)%vals.length];let r=n*p/100;add(`Example ${shift+j+1}: Find ${p}% of ${n}`,[`Write the rule: amount × percentage ÷ 100.`,`Substitute: ${n} × ${p} ÷ 100.`,`Calculate: ${n*p} ÷ 100 = ${r}.`],String(r));}
 }else if(t===3){
  const banks=[[[15,60],[20,80],[25,100],[30,60],[40,80],[10,40]],[[18,48],[35,140],[42,120],[54,180],[27,90],[64,160]],[[17,48],[33,80],[57,160],[91,240],[63,144],[77,200]]];
  const vals=banks[a];
  for(let j=0;j<2;j++){let [part,whole]=vals[(shift+j)%vals.length],r=part/whole*100;add(`Example ${shift+j+1}: ${part} is what percentage of ${whole}?`,[`Identify the part: ${part}; identify the whole: ${whole}.`,`Divide part by whole: ${part} ÷ ${whole} = ${part/whole}.`,`Multiply by 100: ${part/whole} × 100 = ${r}%.`],`${r}%`);}
 }else if(t===4){
  const banks=[[[100,10],[200,20],[400,25],[500,10],[800,25],[600,20]],[[100,15],[200,20],[400,15],[800,25],[1200,10],[1600,20]],[[640,12.5],[800,17.5],[1200,22.5],[1600,12.5],[2400,37.5],[3200,17.5]]];
  const vals=banks[a];
  for(let j=0;j<2;j++){let [n,p]=vals[(shift+j)%vals.length],up=(shift+j)%2===0,change=n*p/100,r=n+(up?change:-change);add(`Example ${shift+j+1}: ${n} ${up?"increases":"decreases"} by ${p}%`,[`Find the change: ${n} × ${p} ÷ 100 = ${change}.`,`Because this is a ${up?"increase":"decrease"}, ${up?"add":"subtract"} the change ${up?"to":"from"} ${n}.`,`New amount = ${r}.`],String(r));}
 }else if(t===5){
  const banks=[[[100,10],[200,15],[400,20],[500,10],[800,25],[600,20]],[[100,5],[200,15],[400,20],[800,25],[1200,10],[1600,20]],[[640,12.5],[800,17.5],[1200,22.5],[1600,12.5],[2400,37.5],[3200,17.5]]];
  const vals=banks[a];
  for(let j=0;j<2;j++){let [cp,p]=vals[(shift+j)%vals.length],profit=(shift+j)%2===0,change=cp*p/100,sp=cp+(profit?change:-change);add(`Example ${shift+j+1}: CP ₹${cp}, ${p}% ${profit?"profit":"loss"}`,[`Cost price (CP) = ₹${cp}.`,`Find ${profit?"profit":"loss"}: ${cp} × ${p} ÷ 100 = ₹${change}.`,`Selling price = ${profit?"CP + profit":"CP − loss"} = ₹${sp}.`],`₹${sp}`);}
 }else{
  const banks=[[[100,10],[200,15],[400,20],[500,25],[800,10],[1000,20]],[[200,5],[400,15],[500,20],[800,25],[1000,10],[1200,30]],[[240,12.5],[400,17.5],[640,22.5],[800,12.5],[1200,37.5],[1600,17.5]]];
  const vals=banks[a];
  for(let j=0;j<2;j++){let [mp,p]=vals[(shift+j)%vals.length],d=mp*p/100,sp=mp-d;add(`Example ${shift+j+1}: MP ₹${mp}, discount ${p}%`,[`Marked price (MP) = ₹${mp}.`,`Discount = ${mp} × ${p} ÷ 100 = ₹${d}.`,`Selling price = MP − discount = ₹${sp}.`],`₹${sp}`);}
 }
 return examples;
}
function renderWorkedExamples(){
 const host=$("workedExamples");if(!host)return;
 const pair=workedExamplePair(exampleBatch);
 host.innerHTML=pair.map((e,i)=>`<article class="worked-example"><b>${e.title}</b><ol class="steps">${e.steps.map(s=>`<li>${s}</li>`).join("")}</ol><div class="example-answer">Answer: <b>${e.answer}</b></div></article>`).join("");
}
function generateMoreExamples(){exampleBatch++;renderWorkedExamples();}
function updateStickyContext(){
 const el=$("stickyContext");if(!el)return;
 const age=[8,10,12][currentAge],topic=topics[currentTopic]?.name||"Choose a topic";
 const done=topics.filter((_,i)=>completed(currentAge+"-"+i)).length;
 el.innerHTML=`<span class="sticky-chapter">Chapter 8 · Percentage</span><span class="sticky-age">Age ${age} · ${ageNames[currentAge]}</span><b class="sticky-topic">${topic}</b><span class="sticky-progress">${done}/7 mastered</span>`;
}
function setAge(a){
 if(learningRoute!=="flexi") return;
 currentAge=a;renderNav();renderLesson();
}
function nextTopic(){
 let n=topics.findIndex((_,i)=>!completed(currentAge+"-"+i));
 if(n>=0){openTopic(n);return;}
 if(learningRoute==="fixed" && currentAge<2){
   currentAge++;
   openTopic(0);
   $("lesson").insertAdjacentHTML("afterbegin",`<div class="callout good"><b>🎉 Age ${[8,10,12][currentAge-1]} journey completed!</b> You have unlocked Age ${[8,10,12][currentAge]}.</div>`);
   return;
 }
 if(currentAge===2 && topics.every((_,i)=>completed("2-"+i))){
   $("lesson").insertAdjacentHTML("afterbegin",`<div class="callout good"><b>👑 Golden Crown achieved!</b> You have mastered all three journeys.</div>`);
 }
}
function chooseRoute(route){
 learningRoute=route;state.route=route;save();
 $("routePicker").classList.add("hidden");$("appShell").classList.remove("hidden");
 $("guestPill").textContent="Learner mode · "+(route==="fixed"?"Fixed":"Flexi")+" route";
 currentAge=route==="fixed" ? firstIncompleteAge() : 0;
 $("welcome").classList.remove("hidden");$("lesson").classList.add("hidden");
 renderNav();updateCrown();
 if(route==="flexi"){
  $("flexiAgePicker").classList.remove("hidden");
  $("flexiAgePicker").innerHTML=`<div class="callout"><b>Choose your age journey:</b><div class="levels">${ageNames.map((n,i)=>`<button onclick="setAge(${i});openTopic(0)">${['🟢','🔵','🟣'][i]} Age ${[8,10,12][i]}</button>`).join('')}</div></div>`;
 } else { $("flexiAgePicker").classList.add("hidden"); $("flexiAgePicker").innerHTML=""; }
}
function firstIncompleteAge(){
 for(let a=0;a<3;a++) if(!topics.every((_,i)=>completed(a+"-"+i))) return a;
 return 2;
}
function changeRoute(){
 $("appShell").classList.add("hidden");$("routePicker").classList.remove("hidden");
}

renderNav();updateCrown();
handleRecoveryLink();
