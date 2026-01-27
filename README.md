# VeriFact Audit - Deployment Guide

This project is a high-fidelity fact-checking application powered by Google Gemini and Neural Forensics analysis. You can host this application for free on several platforms.

## Option 1: Vercel or Netlify (Recommended)
These platforms are the easiest for applications that use environment variables (like your `API_KEY`).

1. **Create a GitHub Repository**: Upload all these files (`index.html`, `App.tsx`, etc.) to a new repository on your GitHub account.
2. **Connect to Vercel/Netlify**:
   - Log in to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
   - Click "New Project" and select your GitHub repository.
3. **Set the API Key**:
   - During the setup process, look for a section called **Environment Variables**.
   - Add a new variable:
     - **Name**: `API_KEY`
     - **Value**: (Paste your Google Gemini API key here)
4. **Deploy**: Click Deploy. Your site will be live on a custom `vercel.app` or `netlify.app` URL for free!

## Option 2: GitHub Pages
GitHub Pages is great for hosting static sites directly from your repository.

1. **Upload Files**: Push your code to a GitHub repository.
2. **Settings**: Go to the **Settings** tab of your repository.
3. **Pages**: Click on "Pages" in the left sidebar.
4. **Build and Deployment**: Under "Source", select "Deploy from a branch" and choose `main`.
5. **Note on API Keys**: Because GitHub Pages is strictly static, `process.env.API_KEY` won't work automatically like it does in the development environment. For a production GitHub Pages site, you would typically need to use a build tool (like Vite) or a GitHub Action to inject the key, or use a backend proxy.

## Important Note on API Security
When you move this code out of this environment:
- **Do not** hardcode your API key directly into the files and upload them to a public GitHub repository. Anyone who finds your repository can steal your key.
- Using **Vercel** or **Netlify** environment variables is the safest free way to keep your key hidden while keeping your app functional.

## Getting a Gemini API Key
If you don't have a personal key yet, you can get one for free at the [Google AI Studio](https://aistudio.google.com/).
