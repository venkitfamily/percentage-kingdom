function showLoginMessage(message,isError=true){
  const box=$("loginInfo");
  box.classList.remove("hidden");
  box.textContent=message;
  box.classList.toggle("bad",isError);
  box.classList.toggle("good",!isError);
}
async function loginLearner(){
  if(!authConfigured()) return;
  const username=$("username").value.trim();
  const password=$("password").value;
  const button=$("loginButton");
  if(!username || !password){showLoginMessage("Please enter both your username and password.");return;}
  button.disabled=true;button.textContent="Signing in…";
  $("loginInfo").classList.add("hidden");
  try{
    const {data,error}=await supabaseClient.functions.invoke("username-login",{body:{username,password}});
    if(error) throw error;
    if(!data || !data.success || !data.session) throw new Error(data?.error || "The username or password is incorrect.");
    const {error:sessionError}=await supabaseClient.auth.setSession({
      access_token:data.session.access_token,
      refresh_token:data.session.refresh_token
    });
    if(sessionError) throw sessionError;
    const profile=data.profile || {};
    window.currentLearnerProfile=profile;
    window.isKingdomAdmin=profile.role==="admin";
    const adminButton=$("adminDashboardButton");
    if(adminButton)adminButton.style.display=window.isKingdomAdmin?"block":"none";
    const route=profile.learning_route==="flexi"?"flexi":"fixed";
    $("entry").classList.add("hidden");
    $("forgotPanel").classList.add("hidden");
    $("routePicker").classList.add("hidden");
    $("appShell").classList.remove("hidden");
    learningRoute=route;state.route=route;save();
    $("guestPill").textContent=(profile.username || username)+" · "+(route==="fixed"?"Fixed":"Flexi")+" route";
    currentAge=route==="fixed"?firstIncompleteAge():0;
    $("welcome").classList.remove("hidden");$("lesson").classList.add("hidden");
    if(route==="flexi"){
      $("flexiAgePicker").classList.remove("hidden");
      $("flexiAgePicker").innerHTML=`<div class="callout"><b>Choose your age journey:</b><div class="levels">${ageNames.map((n,i)=>`<button onclick="setAge(${i});openTopic(0)">${['🟢','🔵','🟣'][i]} Age ${[8,10,12][i]}</button>`).join('')}</div></div>`;
    }else{$("flexiAgePicker").classList.add("hidden");$("flexiAgePicker").innerHTML="";}
    renderNav();updateCrown();
  }catch(error){
    console.error("Learner login failed",error);
    showLoginMessage(error.message || "Login failed. Please check your details and try again.");
  }finally{
    button.disabled=false;button.textContent="Log in";
  }
}
function authConfigured(){
 if(!supabaseClient){ alert("Supabase is not configured yet. Add your Project URL and anon/publishable key near the top of this file, then upload it to GitHub Pages."); return false; }
 return true;
}
function showForgotPassword(){
 $("entry").classList.add("hidden");
 $("forgotPanel").classList.remove("hidden");
 $("recoveryEmail").value=$("username").value.includes("@")?$("username").value:"";
 $("recoveryMessage").classList.add("hidden");
}
function backToLogin(){ $("forgotPanel").classList.add("hidden"); $("entry").classList.remove("hidden"); $("loginPanel").classList.remove("hidden"); }
async function sendPasswordReset(){
 if(!authConfigured()) return;
 const email=$("recoveryEmail").value.trim(), msg=$("recoveryMessage");
 msg.classList.remove("hidden");
 if(!email){msg.textContent="Please enter your registered email address.";return;}
 msg.textContent="Sending reset link…";
 const redirectTo=window.location.origin+window.location.pathname;
 const {error}=await supabaseClient.auth.resetPasswordForEmail(email,{redirectTo});
 msg.textContent=error?"Could not send the email: "+error.message:"If an account exists for that email, a password-reset link has been sent. Check your inbox and spam folder.";
}
function showNewPasswordPanel(message){
 $("entry").classList.add("hidden");$("forgotPanel").classList.add("hidden");$("routePicker").classList.add("hidden");$("appShell").classList.add("hidden");
 $("newPasswordPanel").classList.remove("hidden");
 if(message){const m=$("newPasswordMessage");m.classList.remove("hidden");m.textContent=message;}
}
async function saveNewPassword(){
 if(!authConfigured()) return;
 const p1=$("newPassword").value,p2=$("confirmPassword").value,m=$("newPasswordMessage");
 m.classList.remove("hidden");
 if(p1.length<8){m.textContent="Use at least 8 characters for your password.";return;}
 if(p1!==p2){m.textContent="The two passwords do not match.";return;}
 m.textContent="Updating password…";
 const {data:sessionData,error:sessionError}=await supabaseClient.auth.getSession();
 if(sessionError || !sessionData.session){
  m.textContent="Your password-reset session is missing or has expired. Please request a new reset link.";
  return;
 }
 const {error}=await supabaseClient.auth.updateUser({password:p1});
 if(error){m.textContent="Password update failed: "+error.message;return;}
 m.textContent="Your password has been updated successfully. Please return to the login screen and sign in with your new password.";
 $("newPassword").value="";$("confirmPassword").value="";
 await supabaseClient.auth.signOut();
}
if(supabaseClient){
 supabaseClient.auth.onAuthStateChange((event)=>{
  if(event==="PASSWORD_RECOVERY") showNewPasswordPanel();
 });
}

async function handleRecoveryLink(){
 if(!supabaseClient) return;

 const query=new URLSearchParams(window.location.search);
 const hash=new URLSearchParams(window.location.hash.replace(/^#/,""));
 const code=query.get("code");
 const hashAccess=hash.get("access_token");
 const hashRefresh=hash.get("refresh_token");
 const isRecovery=hash.get("type")==="recovery" || query.get("type")==="recovery";

 // PKCE password-reset emails normally return a one-time ?code=... parameter.
 if(code){
  const {data,error}=await supabaseClient.auth.exchangeCodeForSession(code);
  if(error || !data.session){
   showNewPasswordPanel("This reset link is invalid, expired, or has already been used. Please request a new password-reset email.");
   return;
  }
  window.history.replaceState({},document.title,window.location.pathname);
  showNewPasswordPanel();
  return;
 }

 // Also support older implicit-flow recovery links.
 if(isRecovery && hashAccess && hashRefresh){
  const {data,error}=await supabaseClient.auth.setSession({
   access_token:hashAccess,
   refresh_token:hashRefresh
  });
  if(error || !data.session){
   showNewPasswordPanel("This reset link is invalid, expired, or has already been used. Please request a new password-reset email.");
   return;
  }
  window.history.replaceState({},document.title,window.location.pathname);
  showNewPasswordPanel();
  return;
 }

 if(isRecovery){
  const {data,error}=await supabaseClient.auth.getSession();
  if(!error && data.session){
   showNewPasswordPanel();
  }else{
   showNewPasswordPanel("This reset link is invalid, expired, or has already been used. Please request a new password-reset email.");
  }
 }
}


// Administrator-only learner creation dashboard.
function openAdminDashboard(){
 if(!window.isKingdomAdmin){alert("Administrator access is required.");return;}
 $("welcome").classList.add("hidden");
 $("lesson").classList.add("hidden");
 $("adminDashboard").classList.remove("hidden");
 $("adminDashboard").innerHTML=`
  <span class="tag">ADMINISTRATION</span>
  <h2>Administrator Dashboard</h2>
  <p class="muted">Create learner accounts. Public registration remains disabled.</p>
  <div class="admin-card">
   <h3>＋ Create a learner</h3>
   <label for="newLearnerUsername">Username</label>
   <input id="newLearnerUsername" type="text" minlength="3" maxlength="30" autocomplete="off" placeholder="e.g. learner01">
   <p class="small">Use 3–30 lowercase letters, numbers or underscores.</p>
   <label for="newLearnerPassword">Temporary password</label>
   <input id="newLearnerPassword" type="password" minlength="10" autocomplete="new-password" placeholder="At least 10 characters">
   <label for="newLearnerRoute">Learning route</label>
   <select id="newLearnerRoute">
    <option value="fixed">Fixed Route (Age 8 → 10 → 12)</option>
    <option value="flexi">Flexi Route (learner chooses)</option>
   </select>
   <button id="createLearnerButton" class="btn" type="button" onclick="createLearnerAccount()">Create learner account</button>
   <div id="createLearnerMessage" class="callout hidden" role="status"></div>
  </div>
  <div class="callout">
   <b>After creating the account</b>
   <ol class="steps">
    <li>Share the username and temporary password securely with the learner.</li>
    <li>Ask the learner to log in using the website.</li>
    <li>They can use Forgot Password if they need to change their password.</li>
   </ol>
  </div>
  <p class="small">Account creation is handled by the secured Supabase Edge Function. This page does not expose a public sign-up option.</p>
  <button class="btn secondary" type="button" onclick="closeAdminDashboard()">← Back to learning</button>`;
}
function closeAdminDashboard(){
 $("adminDashboard").classList.add("hidden");
 $("welcome").classList.remove("hidden");
}
async function createLearnerAccount(){
 if(!window.isKingdomAdmin){alert("Administrator access is required.");return;}
 if(!authConfigured())return;
 const username=$("newLearnerUsername").value.trim().toLowerCase();
 const password=$("newLearnerPassword").value;
 const learning_route=$("newLearnerRoute").value;
 const msg=$("createLearnerMessage"),btn=$("createLearnerButton");
 msg.classList.remove("hidden");msg.classList.remove("good","bad");
 if(!/^[a-z0-9_]{3,30}$/.test(username)){
  msg.textContent="Username must be 3–30 characters and contain only lowercase letters, numbers or underscores.";
  msg.classList.add("bad");return;
 }
 if(password.length<10){
  msg.textContent="Please use a temporary password with at least 10 characters.";
  msg.classList.add("bad");return;
 }
 btn.disabled=true;btn.textContent="Creating account…";
 msg.textContent="Creating the learner account…";
 try{
  const {data,error}=await supabaseClient.functions.invoke("create-learner",{
   body:{username,password,learning_route}
  });
  if(error)throw error;
  if(!data || data.success===false)throw new Error(data?.error||"The account could not be created.");
  msg.textContent=`Learner account “${username}” has been created. Share the username and temporary password securely with the learner.`;
  msg.classList.add("good");
  $("newLearnerUsername").value="";
  $("newLearnerPassword").value="";
 }catch(error){
  console.error("Create learner failed",error);
  msg.textContent=error.message||"Could not create the learner. Please check the username and try again.";
  msg.classList.add("bad");
 }finally{
  btn.disabled=false;btn.textContent="Create learner account";
 }
}
