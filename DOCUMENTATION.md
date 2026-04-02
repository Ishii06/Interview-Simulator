# Project Work Log

Date: 2026-03-28

## Scope Covered

This document summarizes the current implemented state across frontend, backend integration, and ai-python notes, including recent Practice Tests and auth-aware UI changes.

## Frontend Log

### 1) Interview page implemented end-to-end

Implemented a full interview UI and flow in [frontend/app/interview/page.tsx](frontend/app/interview/page.tsx):

- Interview setup form: role, experience, difficulty, skills.
- Start interview action using backend question API.
- Voice capture using MediaRecorder.
- Audio upload for transcription.
- Automatic next-question loop after each transcription.
- Conversation timeline (assistant and user turns).
- Finish and evaluate action.
- Evaluation report rendering (scores, strengths, improvements, recommendation, per-answer breakdown).
- Loading and error handling across all async actions.

### 2) Practice Tests flow implemented and upgraded

Practice Tests are implemented across [frontend/app/practice/page.tsx](frontend/app/practice/page.tsx), [frontend/app/practice/aptitude/page.tsx](frontend/app/practice/aptitude/page.tsx), [frontend/app/practice/aptitude/result/page.tsx](frontend/app/practice/aptitude/result/page.tsx), and [frontend/app/store/testStore.js](frontend/app/store/testStore.js).

Current behavior:

- User-defined test setup on Practice page:
	- role
	- experience
	- difficulty
- Auth-required start:
	- test start buttons are disabled until session check completes and user is logged in
	- unauthenticated user is prompted to login
- Loading UX while creating test:
	- start buttons show: "Your test is being created..."
	- duplicate starts are prevented while request is in progress
- Reduced start latency:
	- create-test response preloads questions into store
	- immediate redundant question fetch is skipped when questions already exist
- Aptitude test page:
	- countdown timer
	- answer capture by question id
	- guarded submit state to avoid double submission
	- auto-submit on timer expiry
- Result page after submit:
	- score
	- percentage
	- correct count
	- per-question review including selected answer, correct answer, correctness badge, and explanation

### 3) Auth store functionality added/expanded

Updated [frontend/app/store/authStore.js](frontend/app/store/authStore.js) with API-based auth actions:

- login(email, password)
- signup({ name, email, password })
- logout()
- fetchCurrentUser()
- initialized state handling
- robust loading and error behavior

### 4) Navbar and landing CTA are now auth-aware

Updated [frontend/app/components/ui/Navbar.tsx](frontend/app/components/ui/Navbar.tsx):

- Replaced mock logged-in state with real auth-store session state.
- Navbar shows "Logout" when logged in.
- Clicking Logout calls backend logout and redirects to login.

Updated [frontend/app/page.tsx](frontend/app/page.tsx):

- Primary CTA is now dynamic:
	- logged out: "Start Free Session" -> /login
	- logged in: "Start your first interview" -> /interview

### 5) Login page wired to real auth

Updated [frontend/app/login/page.tsx](frontend/app/login/page.tsx):

- Controlled email/password fields.
- Submit handler connected to auth store login.
- Required-field validation.
- Error feedback rendering.
- Loading/disabled submit button state.
- Redirect after successful login.

### 6) Signup page wired to real auth

Updated [frontend/app/signup/page.tsx](frontend/app/signup/page.tsx):

- Controlled name/email/password fields.
- Submit handler connected to auth store signup.
- Required-field validation.
- Error and success feedback rendering.
- Loading/disabled submit button state.
- Redirect to login after successful signup.

### 7) Frontend diagnostics status

After implementation, diagnostics checks were run and the touched auth/frontend files were left with no reported errors.

## Backend Integration Log

### 1) Auth routes used by frontend

Frontend auth integration is aligned to these backend auth routes in [backend/routes/authRoutes.js](backend/routes/authRoutes.js):

- POST /signup
- POST /login
- GET /me
- GET /logout

### 2) Auth controller behavior referenced by frontend

Behavior confirmed from [backend/controllers/authController.js](backend/controllers/authController.js):

- Login sets access_token cookie.
- Signup currently uses email/password.
- /me validates cookie and returns current user session.
- Logout clears access token cookie.

### 3) Practice Tests backend behavior

Practice APIs and behavior are implemented in [backend/routes/testRoutes.js](backend/routes/testRoutes.js), [backend/controllers/testController.js](backend/controllers/testController.js), [backend/routes/resultRoutes.js](backend/routes/resultRoutes.js), and [backend/controllers/resultController.js](backend/controllers/resultController.js).

Current behavior:

- POST /api/tests/create:
	- protected route (requires logged-in cookie)
	- user_id is derived from req.user.id, not trusted from client payload
	- validates role/experience/difficulty
	- requests questions from ai-python service
	- inserts test + questions in Supabase
	- returns test metadata and inserted questions
	- includes upstream AI error mapping for clearer non-generic failures
- POST /api/results/submit:
	- protected route
	- user_id derived from req.user.id
	- robust answer normalization (by question id/text/index)
	- computes score and percentage
	- persists result
	- returns detailed review per question:
		- selected_answer
		- correct_answer
		- is_correct
		- explanation

## AI-Python Log

### 1) Service reviewed for interview flow and evaluation behavior

The interview/evaluation service in [ai-python/app/main.py](ai-python/app/main.py) was reviewed to diagnose evaluation-history issues.

### 2) Evaluation hardening work was attempted, then reverted

A patch was previously prepared to improve candidate-answer extraction and JSON robustness in [ai-python/app/main.py](ai-python/app/main.py), but that patch was later undone by user action.

Current status: ai-python file remains in its user-controlled state after revert.

## Notes and Current Status

- Frontend interview flow is implemented in the interview page.
- Frontend auth flow is implemented via centralized store calls and current-user hydration.
- Practice Tests are fully integrated end-to-end with auth-required start and result review UI.
- Backend endpoints are integrated and consumed from frontend with cookie-based auth.
- ai-python evaluation hardening is not currently active because reverted.

## Recommended Next Actions

1. Persist signup name into user profile metadata/storage so UI can show user display name.
2. Add route-level protection for question fetch endpoints if strict ownership checks are required.
3. Re-apply ai-python evaluation hardening when ready, then verify evaluation with real interview transcripts.
4. Run full smoke tests across [frontend/app/interview/page.tsx](frontend/app/interview/page.tsx), [frontend/app/practice/page.tsx](frontend/app/practice/page.tsx), [backend/controllers/interviewController.js](backend/controllers/interviewController.js), [backend/controllers/testController.js](backend/controllers/testController.js), and [ai-python/app/main.py](ai-python/app/main.py).

## Latest Updates (2026-03-29)

This section captures work completed after the original 2026-03-28 log.

### 1) Interview flow split into setup + simulator

Updated interview routing and UI responsibilities:

- [frontend/app/interview/page.tsx](frontend/app/interview/page.tsx) now focuses on:
	- interview setup inputs
	- start action that routes to simulator
	- interview history display
- [frontend/app/interview/simulator/page.tsx](frontend/app/interview/simulator/page.tsx) now handles the live interview session.

### 2) Simulator UI cleanup and history behavior

- Removed duplicate timeline block from simulator when requested.
- Kept in-session conversation history visible so assistant/user turns remain reviewable during the active session.

### 3) Typed-answer experiment (temporary) and rollback

A temporary change was implemented to test non-voice interview progression:

- Added text answer + next question flow in simulator.
- Added temporary backend endpoint for saving typed answers.

After user direction to keep voice flow, these changes were fully reverted:

- Simulator restored to MediaRecorder + transcription workflow.
- Temporary typed-answer backend route/controller logic removed.

### 4) Voice interview flow restored (current behavior)

Current simulator behavior in [frontend/app/interview/simulator/page.tsx](frontend/app/interview/simulator/page.tsx):

- Start interview
- Record with microphone
- Stop recording
- Upload audio for transcription
- Append transcript as user message
- Auto-generate next question
- Evaluate interview at end

### 5) AI audio 404 fix

Resolved missing audio playback issue where generated question audio URLs returned 404.

- Updated [ai-python/app/main.py](ai-python/app/main.py) to mount static file serving for the audio directory:
	- `app.mount("/audio", StaticFiles(directory="audio"), name="audio")`

Impact:

- `/audio/<file>.wav` is now served by FastAPI (after AI service restart), so generated interview audio can be fetched by frontend.

### 6) Diagnostics status for latest changes

Post-change diagnostics were run on touched files, with no reported errors in:

- [frontend/app/interview/page.tsx](frontend/app/interview/page.tsx)
- [frontend/app/interview/simulator/page.tsx](frontend/app/interview/simulator/page.tsx)
- [backend/controllers/interviewController.js](backend/controllers/interviewController.js)
- [backend/routes/interviewRoutes.js](backend/routes/interviewRoutes.js)
- [ai-python/app/main.py](ai-python/app/main.py)

## Final Summary (2026-03-29)

Quick summary of completed work:

- Interview experience was restructured into two pages:
	- setup + history page
	- simulator page for active interview flow
- Simulator behavior was cleaned up and stabilized while preserving conversation history visibility.
- A temporary typed-answer implementation was created for testing and then fully reverted per product direction.
- Final simulator behavior now remains voice-first:
	- microphone recording
	- backend transcription
	- next-question generation loop
	- final evaluation report
- AI audio playback issue was resolved by serving generated files from the audio directory in the Python service.
- Frontend, backend, and ai-python touched files were validated with diagnostics and left without reported errors.

Current stable state:

- Voice interview simulator is active and integrated end-to-end.
- Interview history remains available.
- Generated question audio is accessible through the AI service static audio route.

## Latest Updates (2026-04-02)

### 1) 3D avatar model integration in simulator

Added and wired a 3D interview avatar in [frontend/app/components/ui/InterviewAvatar.tsx](frontend/app/components/ui/InterviewAvatar.tsx) and simulator usage in [frontend/app/interview/simulator/page.tsx](frontend/app/interview/simulator/page.tsx).

Current behavior:

- Simulator renders Ready Player Me style GLB avatar component.
- Avatar model path used by simulator:
	- /avatar/rpm-avatar.glb
- Public asset location expected by Next.js:
	- [frontend/public/avatar](frontend/public/avatar)

### 2) Lip-sync JSON playback flow connected

Avatar lip-sync now consumes Rhubarb mouth cues JSON generated by the AI service.

- AI service generates and exposes cue files from [ai-python/app/main.py](ai-python/app/main.py).
- Frontend fetches the lip-sync JSON URL in [frontend/app/components/ui/InterviewAvatar.tsx](frontend/app/components/ui/InterviewAvatar.tsx).
- Mouth cue values are mapped to RPM visemes and animated frame-by-frame.

### 3) WebGL context-loss handling added

Hardened avatar renderer for browser GPU context resets in [frontend/app/components/ui/InterviewAvatar.tsx](frontend/app/components/ui/InterviewAvatar.tsx).

Implemented:

- Detection for webglcontextlost and webglcontextrestored events.
- Context-loss fallback UI instead of silent/broken render.
- Manual reset action to remount canvas and recover renderer.
- Renderer pressure reduction with controlled DPR and renderer options.

### 4) CORS fix for avatar lip-sync fetch

Resolved cross-origin block when frontend (port 3000) fetched AI static JSON/audio (port 8000).

- Added FastAPI CORS middleware in [ai-python/app/main.py](ai-python/app/main.py).
- Allowed localhost frontend origins:
	- http://localhost:3000
	- http://127.0.0.1:3000

Impact:

- Browser can now read /audio/*.json responses used by avatar lip-sync fetch.

### 5) Current known operational requirement

- Ensure the GLB file exists at [frontend/public/avatar](frontend/public/avatar) with the expected filename rpm-avatar.glb, or update the simulator model path in [frontend/app/interview/simulator/page.tsx](frontend/app/interview/simulator/page.tsx).
