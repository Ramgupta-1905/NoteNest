# 📝 NoteNest — Your Thoughts, Organized.

**NoteNest** is a full-stack notes management application designed to make capturing ideas, organizing thoughts, and managing everyday notes simple and intuitive. With a clean interface, colorful note cards, and practical organization tools, NoteNest brings your notes together in one convenient workspace.

## ✨ Key Features

- **📝 Note Management** — Create, view, and edit notes with ease.
- **🎨 Color-Coded Organization** — Use different colors to visually organize your notes.
- **🔍 Instant Search** — Find notes quickly by searching their titles and content.
- **⭐ Favorites** — Mark important notes for quick access.
- **🗑️ Smart Trash Management** — Move notes to Trash, restore them when needed, or permanently delete them.
- **↕️ Flexible Sorting** — Organize notes by newest or oldest.
- **🌙 Dark Mode** — Switch between light and dark themes for a comfortable viewing experience.
- **💾 Persistent Data Storage** — Keep notes saved in PostgreSQL, even after refreshing the application.
- **📱 Responsive Interface** — Enjoy a layout designed to adapt to different screen sizes.
- **⚠️ Error Handling** — Receive feedback when backend operations fail.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React | Building the interactive user interface |
| Vite | Frontend development and build tooling |
| JavaScript | Application logic and interactivity |
| Tailwind CSS & CSS | Styling and responsive layouts |
| Node.js | Backend runtime environment |
| Express.js | Building RESTful APIs |
| PostgreSQL | Persistent relational data storage |
| REST API & JSON | Communication between frontend and backend |

## 🏗️ How It Was Built

NoteNest follows a **client–server architecture**, separating the user interface, backend logic, and database responsibilities.

**Frontend Development**

The frontend was developed using React and Vite, with reusable components for the sidebar, toolbar, notes grid, and note-related modals. React state manages interactive features such as searching, sorting, favorites, and theme switching, while the interface presents notes in an organized, color-coded layout.

**Backend Development**

The backend was built with Node.js and Express.js. RESTful API endpoints handle note creation, retrieval, updates, and deletion, along with Trash management and note restoration. Request validation and error handling help manage unsuccessful operations.

**Database Integration**

PostgreSQL stores note details, colors, favorite status, Trash status, and timestamps. The frontend communicates with the backend through HTTP requests, allowing changes to be saved persistently rather than existing only in browser memory.

**End-to-End Integration**

The frontend, backend, and database work together to provide a complete note management experience. The application was tested locally to verify note persistence and the main note management operations.

## 🎯 Project Goals

NoteNest was developed as a full-stack development project to apply practical concepts in modern frontend development, REST API design, server-side programming, relational database integration, and persistent CRUD operations.

The project emphasizes a modular application structure, reusable UI components, clear separation of responsibilities, and a smooth user experience.

## 👨‍💻 Author

**Ram Gupta**

---

*Designed to capture ideas. Built to keep them organized.*

