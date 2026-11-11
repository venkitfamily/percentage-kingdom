const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
function makeQ(){
 let t=currentTopic, a=currentAge, x,y,p,ans,question,ex;
 if(t===0){p=[10,20,25,50,75][rnd(0,4)];question=a===0?`There are 100 stars. ${p} are gold. How many percent are gold?`:`What does ${p}% mean out of 100?`;ans=p;ex=`${p}% means ${p} out of 100.`}
 else if(t===1){
  let sets=[[ [1,2,50],[1,4,25],[3,4,75],[1,5,20],[3,5,60] ],[[1,2,50],[3,5,60],[7,10,70],[9,20,45],[1,4,25]],[[3,8,37.5],[7,20,35],[9,25,36],[11,40,27.5],[13,50,26]]][a];
  let s=sets[rnd(0,sets.length-1)];question=`Convert ${s[0]}/${s[1]} into a percentage.`;ans=s[2];ex=`${s[0]} ÷ ${s[1]} × 100 = ${s[2]}%.`;
 }else if(t===2){p=[10,15,20,25,40,50,60][rnd(0,6)];x=[80,120,150,200,240,500,1500][rnd(0,6)];ans=x*p/100;question=`Find ${p}% of ${x}.`;ex=`${x} × ${p} ÷ 100 = ${ans}.`}
 else if(t===3){y=[40,50,60,75,80,100,120,150,200][rnd(0,8)];p=[20,25,30,40,50,60,75][rnd(0,6)];x=y*p/100;question=`${x} is what percentage of ${y}?`;ans=p;ex=`(${x} ÷ ${y}) × 100 = ${p}%.`}
 else if(t===4){p=[10,15,20,25,30][rnd(0,4)];x=[100,200,400,500,800,1000][rnd(0,5)];let inc=rnd(0,1)===1;ans=x*(100+(inc?p:-p))/100;question=`An amount of ${x} ${inc?'increases':'decreases'} by ${p}%. What is the new amount?`;ex=`${x} × ${inc?100+p:100-p} ÷ 100 = ${ans}.`}
 else if(t===5){p=[5,10,15,20,25][rnd(0,4)];x=[100,200,400,500,800,1000][rnd(0,5)];let profit=rnd(0,1)===1;ans=x*(100+(profit?p:-p))/100;question=`An item costs ₹${x}. It is sold at a ${p}% ${profit?'profit':'loss'}. Find its selling price.`;ex=`SP = CP × (${profit?100+p:100-p}) ÷ 100 = ₹${ans}.`}
 else {p=[5,10,15,20,25,30][rnd(0,5)];x=[200,400,500,800,1000,1200,1500][rnd(0,6)];ans=x*(100-p)/100;question=`The marked price is ₹${x}. A discount of ${p}% is given. Find the selling price.`;ex=`Discount = ${x} × ${p} ÷ 100. Selling price = ${x} − discount = ₹${ans}.`}
 if(a===2 && t===5){/* tougher level still same concept; reverse CP */}
 if(a===2 && t===2 && rnd(0,1)){let pct=[20,25,40,50][rnd(0,3)],part=[40,50,60,80,100,120][rnd(0,5)];let whole=part*100/pct;question=`${part} is ${pct}% of what number?`;ans=whole;ex=`Whole = part × 100 ÷ percent = ${part} × 100 ÷ ${pct} = ${whole}.`}
 return {question,ans,ex};
}
function startRound(){questions=Array.from({length:5},makeQ);qIndex=0;correct=0;answered=false;showQ()}
function showQ(){
 const q=questions[qIndex],box=$("quiz");if(!q){box.innerHTML="";return}
 box.innerHTML=`<div class="row"><span class="tag">QUESTION ${qIndex+1} / 5</span><span class="small">Correct: ${correct}</span></div><h3>${q.question}</h3><input id="answer" type="number" step="any" placeholder="Type your answer" onkeydown="if(event.key==='Enter')checkAnswer()"><div><button class="btn" onclick="checkAnswer()">Check answer</button><button class="btn secondary" onclick="hint()">Hint</button></div><div id="feedback" class="feedback"></div><div class="progress" style="margin-top:14px"><span style="width:${qIndex/5*100}%"></span></div>`;
}
function hint(){$("feedback").innerHTML="Hint: "+(currentTopic===0?"Remember: percent means out of 100.":currentTopic===1?"Divide the numerator by the denominator, then multiply by 100.":currentTopic===2?"Multiply the amount by the percentage, then divide by 100.":currentTopic===3?"Divide the part by the whole, then multiply by 100.":currentTopic===4?"Use original amount × (100 ± rate) ÷ 100.":currentTopic===5?"Profit or loss percentage is based on cost price.":"Discount percentage is based on marked price.");}
function checkAnswer(){
 if(answered)return;let v=Number($("answer").value);if($("answer").value.trim()===""){ $("feedback").textContent="Enter an answer first.";return}
 let q=questions[qIndex],ok=Math.abs(v-q.ans)<0.011;answered=true;if(ok)correct++;
 $("feedback").innerHTML=ok?'<span class="good">Correct! ⭐</span>':`<span class="bad">Not quite.</span> ${q.ex}`;
 $("quiz").insertAdjacentHTML("beforeend",`<button class="btn" onclick="nextQ()">${qIndex===4?'See result':'Next question →'}</button>`);
}
function nextQ(){
 qIndex++;answered=false;if(qIndex<5){showQ();return}
 const box=$("quiz");if(correct===5){state.done[key()]=true;save();box.innerHTML=`<h3 class="good">🏆 Gate mastered! 100%</h3><p>You answered all five questions correctly. This topic is now complete for the ${ageNames[currentAge]} journey.</p><button class="btn" onclick="nextTopic()">Next topic →</button><button class="btn secondary" onclick="startRound()">Practise again</button>`}
 else{box.innerHTML=`<h3>Score: ${correct}/5 · ${correct*20}%</h3><p>You need 100% to open this gate. No problem — every new round gives you fresh questions.</p><button class="btn" onclick="startRound()">Try a fresh round</button>`}
 renderNav();updateCrown();
}
