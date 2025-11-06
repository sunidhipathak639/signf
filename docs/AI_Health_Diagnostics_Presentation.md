# SIGNF AI Health Diagnostics

## 1. Overview
- AI-assisted symptom capture using a 2D/3D interactive body map
- Structured inputs: body region, symptom category, intensity
- Generates a clear analysis report with guidance and export options

## 2. User Flow
- Login with Google to access protected features
- Select a body area on 2D canvas or 3D view
- Record category and intensity in the edit modal
- Review recorded symptoms and open Analysis Report
- Export report as PDF for sharing or follow-up

## 3. Architecture
- Frontend: React with MUI for UI components
- Visualization: Canvas 2D; Three.js and fiber for 3D
- State: Redux for auth and global state; local stores for analysis
- Auth: Firebase Authentication with access tokens
- Export: html2canvas and jsPDF to render and save reports

## 4. 2D and 3D Interaction
- 2D: hit-tested regions on canvas; click opens prefilled modal
- 3D: orbit controls with selectable proxy meshes; onSelectPart triggers modal
- Consistent behavior across views to avoid user confusion
- Keyboard and mouse gestures for zoom and pan where applicable

## 5. Symptom Analysis and Reports
- Aggregates symptoms by body region and category
- Normalizes intensity into severity tiers
- Highlights potential concerns and suggested next steps
- Produces a structured report with metrics, chips, and progress bars
- One-click PDF export from the analysis modal

## 6. Privacy and Security
- Token-based authentication; protects diagnostic features behind login
- Minimal local storage of sensitive data; opt-in export only
- Clear session handling and logout from Navbar
- Future option to integrate consent and retention policies

## 7. Demo Script
- Log in from the Home or Navbar using Google
- Navigate to Health Diagnostics
- Switch off 3D view to use 2D canvas
- Click a body region; edit modal opens with prefill if present
- Choose category, set intensity, save, and check Recorded Symptoms
- Open Analysis Report and export PDF

## 8. Roadmap
- ML-driven symptom ontology and differential suggestions
- Expand body regions and finer granularity on selection
- Structured data export and EHR/FHIR integration
- Accessibility improvements and multi-language support