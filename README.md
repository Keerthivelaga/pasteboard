# 📋 PasteBoard — Clipboard Manager & Chrome Extension

PasteBoard is a fast, minimal clipboard manager built using React that allows users to save, organize, and reuse text snippets efficiently. It works both as a **web application** and a **Chrome extension** with automatic clipboard capture across any website.

---

## 🚀 Features

### ✨ Core Features

* Save and manage text snippets instantly
* Tag-based organization and filtering
* Instant search across all snippets
* Pin important snippets for quick access
* Edit and delete snippets
* Keyboard-first experience (shortcuts support)

### ⚡ Advanced Features

* 📋 Copy all snippets at once
* 📤 Export snippets as JSON
* 🧠 Duplicate detection while saving
* 💾 Persistent storage using IndexedDB

### 🧩 Chrome Extension Features

* Auto-capture copied text from any website
* Lightweight popup interface for quick access
* Background service worker + content script architecture
* Uses Chrome Storage API for persistence

---

## 🧠 Tech Stack

### Frontend

* React (Hooks-based architecture)
* Vite (fast build tool)

### Storage

* IndexedDB (Web version)
* Chrome Storage API (Extension version)

### Chrome Extension

* Manifest V3
* Content Scripts (capture copy events)
* Background Service Worker (handle storage)
* Messaging system between scripts

---

## 🏗️ Architecture Overview

PasteBoard is designed to work in **two environments**:

| Mode                | Storage Used   |
| ------------------- | -------------- |
| 🌐 Web App          | IndexedDB      |
| 🧩 Chrome Extension | Chrome Storage |

The app dynamically detects the environment and switches storage accordingly.

---

## 🧩 Chrome Extension Setup

1. Build the project:

   ```bash
   npm run build
   ```

2. Open Chrome and go to:

   ```
   chrome://extensions/
   ```

3. Enable **Developer Mode**

4. Click **Load Unpacked**

5. Select the `extension/` folder

---

## 💻 Run Locally

```bash
npm install
npm run dev
```

Then open:

```
http://localhost:5173
```

---

## 📂 Project Structure

```
src/
  components/
  hooks/
  utils/
extension/
  manifest.json
  content.js
  background.js
```

---

## 🎯 Key Highlights

* Built a dual-mode application supporting both web and extension environments
* Implemented cross-site clipboard capture using Chrome content scripts
* Designed a messaging system between content scripts and background service worker
* Optimized state management with custom React hooks
* Developed a keyboard-first UX for faster productivity

---
