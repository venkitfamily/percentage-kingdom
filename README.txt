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
