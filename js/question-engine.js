// Question generation with persistent recent-question history.
// The history is scoped to each age journey and topic.
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=arr=>arr[rnd(0,arr.length-1)];
const contexts=["stars","marbles","books","flowers","apples","students","stickers","shells","balloons","crayons","coins","leaves"];
function buildQuestion(){
 const t=currentTopic,a=currentAge;
 let x,p,ans,question,ex,ctx=pick(contexts),inc,frac;
 if(t===0){
  p=pick(a===0?[10,20,25,50,75]:a===1?[5,10,15,20,25,40,50,60,75,80,90]:[5,10,12.5,15,20,25,30,37.5,40,50,62.5,75,80,90]);
  const total=100;
  question=a===0?`There are ${total} ${ctx}. ${p} are selected. What percentage are selected?`:`What does ${p}% mean out of 100?`;
  ans=p;ex=`Percent means “out of 100”. So ${p}% means ${p} out of every 100.`;
 }else if(t===1){
  const sets=[
   [[1,2,50],[1,4,25],[3,4,75],[1,5,20],[2,5,40],[3,5,60],[4,5,80],[1,10,10],[7,10,70],[9,10,90]],
   [[1,2,50],[3,5,60],[7,10,70],[9,20,45],[1,4,25],[2,5,40],[3,4,75],[7,20,35],[4,5,80],[9,25,36],[3,8,37.5],[5,8,62.5]],
   [[3,8,37.5],[7,20,35],[9,25,36],[11,40,27.5],[13,50,26],[7,16,43.75],[5,16,31.25],[17,40,42.5],[19,25,76],[7,32,21.875],[9,16,56.25],[13,20,65]]
  ];
  frac=pick(sets[a]);question=`${pick(["A learner has","In a group, the fraction is","A shaded part represents","A collection shows"])} ${frac[0]}/${frac[1]}. Convert this fraction into a percentage.`;ans=frac[2];ex=`Divide the numerator by the denominator, then multiply by 100: (${frac[0]} ÷ ${frac[1]}) × 100 = ${ans}%.`;
 }else if(t===2){
  p=pick(a===0?[10,25,50,75]:a===1?[10,15,20,25,40,50,60,75]:[12.5,15,20,25,30,37.5,40,50,60,75]);
  x=pick(a===0?[20,40,60,80,100,200]:a===1?[80,120,150,200,240,300,400,500,800,1000]:[160,240,320,400,480,600,800,1200,1500,2000]);
  ans=x*p/100;question=`Find ${p}% of ${x}.`;ex=`Multiply the amount by the percentage and divide by 100: ${x} × ${p} ÷ 100 = ${ans}.`;
 }else if(t===3){
  const pairs=a===0?[[5,20],[10,20],[10,40],[15,30],[20,40],[25,50],[30,60],[40,80]]:
   a===1?[[12,40],[15,60],[20,80],[25,100],[30,120],[36,90],[45,150],[60,200],[75,300]]:
   [[18,48],[21,60],[27,90],[35,80],[42,120],[54,150],[72,160],[84,240],[96,320]];
  [x,p]=pick(pairs);ans=x/p*100;question=`${x} is what percentage of ${p}?`;ex=`Divide the part by the whole, then multiply by 100: (${x} ÷ ${p}) × 100 = ${ans}%.`;
 }else if(t===4){
  p=pick(a===0?[10,20,25,50]:a===1?[5,10,15,20,25,30]:[5,10,12.5,15,20,25,30]);
  x=pick(a===0?[40,80,100,200]:a===1?[100,200,400,500,800,1000]:[160,240,400,640,800,1200,1600]);
  inc=Math.random()<.5;ans=x*(100+(inc?p:-p))/100;
  question=`An amount of ${x} ${inc?"increases":"decreases"} by ${p}%. What is the new amount?`;
  ex=`${p}% of ${x} = ${x} × ${p} ÷ 100 = ${x*p/100}. ${inc?"Add":"Subtract"} this ${inc?"increase":"decrease"} ${inc?"to":"from"} ${x}: the new amount is ${ans}.`;
 }else if(t===5){
  p=pick(a===0?[10,20,25]:a===1?[5,10,15,20,25]:[5,10,12.5,15,20,25]);
  x=pick(a===0?[100,200,400]:a===1?[100,200,400,500,800,1000]:[160,240,400,640,800,1200]);
  inc=Math.random()<.5;ans=x*(100+(inc?p:-p))/100;
  question=`An item costs ₹${x}. It is sold at a ${p}% ${inc?"profit":"loss"}. Find its selling price.`;
  ex=`${inc?"Profit":"Loss"} = ${x} × ${p} ÷ 100 = ₹${x*p/100}. ${inc?"Add the profit":"Subtract the loss"} ${inc?"from":"from"} the cost price: selling price = ₹${ans}.`;
 }else{
  p=pick(a===0?[10,20,25]:a===1?[5,10,15,20,25,30]:[5,10,12.5,15,20,25,30]);
  x=pick(a===0?[100,200,400,500]:a===1?[200,400,500,800,1000,1200,1500]:[240,400,640,800,1200,1600,2000]);
  ans=x*(100-p)/100;question=`The marked price of an item is ₹${x}. A discount of ${p}% is given. Find the selling price.`;
  ex=`Discount = ${x} × ${p} ÷ 100 = ₹${x*p/100}. Selling price = marked price − discount = ₹${ans}.`;
 }
 return {question,ans,ex};
}
function historyKey(){return `${currentAge}-${currentTopic}`;}
function makeQ(used){
 const hist=state.questionHistory||(state.questionHistory={});
 const old=hist[historyKey()]||[];
 for(let i=0;i<600;i++){
  const q=buildQuestion();
  if(!used.has(q.question)&&!old.includes(q.question)){
   used.add(q.question);return q;
  }
 }
 // A safety fallback: avoid within-round duplicates even if a very small pool is exhausted.
 for(let i=0;i<600;i++){const q=buildQuestion();if(!used.has(q.question)){used.add(q.question);return q;}}
 return buildQuestion();
}
function startRound(){
 const used=new Set();questions=Array.from({length:5},()=>makeQ(used));
 const hist=state.questionHistory||(state.questionHistory={});
 hist[historyKey()]=[...(hist[historyKey()]||[]),...questions.map(q=>q.question)].slice(-60);
 save();qIndex=0;correct=0;answered=false;showQ();
}
function showQ(){
 const q=questions[qIndex],box=$("quiz");if(!q){box.innerHTML="";return}
 box.innerHTML=`<div class="row"><span class="tag">QUESTION ${qIndex+1} / 5</span><span class="small">Correct: ${correct}</span></div><h3>${q.question}</h3><input id="answer" type="number" step="any" inputmode="decimal" placeholder="Type your answer" onkeydown="if(event.key==='Enter')checkAnswer()"><div><button class="btn" onclick="checkAnswer()">Check answer</button><button class="btn secondary" onclick="hint()">Hint</button></div><div id="feedback" class="feedback"></div><div class="progress" style="margin-top:14px"><span style="width:${qIndex/5*100}%"></span></div>`;
}
function hint(){$("feedback").innerHTML="Hint: "+(currentTopic===0?"Remember: percent means out of 100.":currentTopic===1?"Divide the numerator by the denominator, then multiply by 100.":currentTopic===2?"Multiply the amount by the percentage, then divide by 100.":currentTopic===3?"Divide the part by the whole, then multiply by 100.":currentTopic===4?"Find the percentage change, then add or subtract it from the original amount.":currentTopic===5?"Profit or loss is calculated from the cost price.":"Find the discount, then subtract it from the marked price.");}
function checkAnswer(){
 if(answered)return;let v=Number($("answer").value);if($("answer").value.trim()===""){ $("feedback").textContent="Enter an answer first.";return}
 let q=questions[qIndex],ok=Math.abs(v-q.ans)<0.011;answered=true;if(ok)correct++;
 $("feedback").innerHTML=ok?'<span class="good">Correct! ⭐</span>':`<span class="bad">Not quite.</span> ${q.ex}`;
 $("quiz").insertAdjacentHTML("beforeend",`<button class="btn" onclick="nextQ()">${qIndex===4?'See result':'Next question →'}</button>`);
}
function nextQ(){
 qIndex++;answered=false;if(qIndex<5){showQ();return}
 const box=$("quiz");if(correct===5){state.done[key()]=true;save();box.innerHTML=`<h3 class="good">🏆 Gate mastered! 100%</h3><p>You answered all five questions correctly. This topic is now complete for the ${ageNames[currentAge]} journey.</p><button class="btn" onclick="nextTopic()">Next topic →</button><button class="btn secondary" onclick="startRound()">Practise again</button>`}
 else{box.innerHTML=`<h3>Score: ${correct}/5 · ${correct*20}%</h3><p>You need 100% to open this gate. No problem — your next round will avoid recently asked questions.</p><button class="btn" onclick="startRound()">Try a fresh round</button>`}
 renderNav();updateCrown();updateStickyContext();
}
