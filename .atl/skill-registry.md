# Skill Registry - PrimerClic

## Project Stack
- **Framework**: Electron (v30+)
- **Backend**: Node.js (v24+), better-sqlite3
- **Frontend**: HTML5, Vanilla CSS, Vanilla JS
- **Architecture**: Single Page Application (SPA) with Hash routing

## Compact Rules

### 🛡️ Security & Architecture
- **Process Isolation**: DO NOT use `nodeIntegration: true` in renderer. Use `contextBridge` in `preload.js` for all IPC communication.
- **Database Access**: All DB operations must occur in the **Main process**. Never expose direct DB handles to the renderer.
- **IPC Naming**: Use `namespace:action` pattern (e.g., `data:getNiveles`).

### 🎨 Design System (Microsoft Enterprise)
- **Borders**: No rounded corners (`border-radius: 0`) except for specific small elements like badges.
- **Typography**: Primary font `Segoe UI Variable`, fallback `Segoe UI`.
- **Aesthetics**: Pastel backgrounds, high contrast text, Fluent Design elevations.
- **Scrollbars**: Minimalist, custom webkit scrollbars defined in `styles.css`.

### 🧪 Quality & Testing
- **Validation**: Use strict mode in JS.
- **Simulations**: Must use `simulacion-core.js` and `simulacion-core.css` for consistent instructional feedback.

## User Skills Trigger Table
| Trigger | Skill to load |
| ------- | ------------- |
| "new simulation", "nueva simulacion" | sdd-apply |
| "bug", "error", "fix" | debug-failing-test |
| "revisar", "review" | judgment-day |
