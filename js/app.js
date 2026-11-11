const state=JSON.parse(localStorage.getItem("pctKingdom")||'{"done":{},"best":{},"route":null}');
if(!("route" in state)) state.route=null;
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
 <div class="practice"><h3>4. Mastery challenge</h3><p>Answer 5 fresh questions. You need <b>5 out of 5 (100%)</b> to master this gate. If you miss one, practise a new round.</p><div id="quiz"></div></div>
 <p class="footer">${done?'💎 This topic is mastered. You can practise again to strengthen your skills.':'This gate is not yet mastered. Keep practising until you score 100%.'}</p>`;
 startRound();
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
