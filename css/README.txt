THE PERCENTAGE KINGDOM — MODULAR VERSION

Files:
index.html — website entry point
css/style.css — current styling and mobile rules
js/config.js — Supabase public URL/key and client setup
js/data/chapter-8.js — Chapter 8 topics and age-level content
js/question-engine.js — generated quiz questions, hints and checking
js/auth.js — username login and password recovery
js/app.js — navigation, lesson rendering, routes and progress

UPLOAD:
1. Unzip this package.
2. Upload ALL files and folders inside it to the existing GitHub repository.
3. Preserve the css/ and js/ folder structure and filenames.
4. Replace index.html when prompted, then commit.
5. Wait for GitHub Pages deployment and refresh the website.

This is a structural refactor only. Existing lesson content and behaviour are retained.
Progress is still stored in browser localStorage; Supabase cross-device progress sync is a later development stage.
The publishable key is safe for browser use with appropriate Supabase RLS and Edge Function security. Never use a service-role key in the website.


Next release changes:
- Question generator records recent questions separately for each age/topic and avoids repeats across rounds (including after refresh).
- Each topic shows two worked examples with step-by-step explanations; learners can request two more examples repeatedly.
- Compact sticky topic context bar on mobile.
- Existing Supabase login/auth files are retained unchanged.


Release 3 - Administrator learner creation:
- Admin Dashboard button is displayed only when the authenticated profile role is "admin".
- Admin can create learner accounts using the existing Supabase Edge Function "create-learner".
- Form fields: username, temporary password, learning route (fixed/flexi).
- Learner accounts are not created through public sign-up.
- IMPORTANT: The Supabase Edge Function must enforce administrator role authorization server-side. Hiding the dashboard in the browser is not a security boundary. Verify the deployed create-learner function checks both the authenticated user and profiles.role = 'admin' before creating accounts.
