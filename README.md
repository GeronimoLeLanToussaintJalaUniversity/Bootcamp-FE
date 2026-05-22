# Angular Tutor with Claude Code

An interactive Angular tutorial powered by Claude Code and the Angular CLI MCP server.

---

## Setup

### 1. Install the Angular CLI

```bash
npm install -g @angular/cli
```

### 2. Angular CLI MCP Configuration

The tutor works through an MCP (Model Context Protocol) server that gives Claude direct access to the Angular CLI. The configuration is already included in this repository:

**`.claude/mcp.json`**

```json
{
  "mcpServers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}
```

**`.claude/settings.local.json`**

```json
{
  "permissions": {
    "allow": [
      "Bash(cat:*)"
    ]
  },
  "enabledMcpjsonServers": ["angular-cli"]
}
```

> **Important:** Do not delete these files. The Angular tutor will not work without them.

### 3. Create the Angular Project

From this folder, run:

```bash
ng new smart-recipe-box
```

Recommended options during creation:

- **Stylesheet format:** CSS
- **Server-Side Rendering:** No

Then navigate into the project and start the dev server:

```bash
cd smart-recipe-box
ng serve
```

Open `http://localhost:4200` in your browser to verify everything is working.

### 4. Start the Tutor

1. Open Claude Code in this folder (`angular tutor`).
2. Type `/mcp` to verify the Angular MCP server is active.
3. Tell Claude: *"I want you to use the Angular tutor MCP"*.
4. Claude will analyze the project and begin the tutoring session.

---

## Smart Recipe Box — Learning Journey

A step-by-step Angular v21 project built through a guided tutorial. Each module introduces a new concept applied directly to this application.

### Phase 1: Angular Fundamentals

| Module | Topic | Key Concepts |
|--------|-------|--------------|
| 1 | Getting Started | Project structure and app setup |
| 2 | Dynamic Text with Interpolation | Displaying data with `{{ }}` and signals |
| 3 | Event Listeners | Responding to user interactions with `(click)` |

### Phase 2: State and Signals

| Module | Topic | Key Concepts |
|--------|-------|--------------|
| 4 | Writable Signals — Part 1 | Managing state with `.set()` |
| 5 | Writable Signals — Part 2 | Updating state with `.update()` |
| 6 | Computed Signals | Deriving state automatically with `computed()` |

### Phase 3: Component Architecture

| Module | Topic | Key Concepts |
|--------|-------|--------------|
| 7 | Template Binding | Binding to element properties with `[property]` |
| 8 | Creating & Nesting Components | Generating and composing components |
| 9 | Component Inputs with Signals | Passing data with `input()` |
| 10 | Styling Components | Flexbox, visual hierarchy, and whitespace |
| 11 | List Rendering | Displaying collections with `@for` |
| 12 | Conditional Rendering | Showing/hiding elements with `@if` |

### Phase 4: Advanced Features & Architecture

| Module | Topic | Key Concepts |
|--------|-------|--------------|
| 13 | Two-Way Binding | Syncing data with form inputs using `ngModel` |
| 14 | Services & Dependency Injection | Centralizing logic with `inject()` |
| 15 | Basic Routing | Navigation with `provideRouter` and `routerLink` |
| 16 | Reactive Forms | Handling user input with `ReactiveFormsModule` |
| 17 | Angular Material | Using a professional UI component library |

### Phase 5: Experimental Signal Forms

> ⚠️ **Warning:** This phase covers experimental features. The API may change in future Angular releases.

| Module | Topic | Key Concepts |
|--------|-------|--------------|
| 18 | Introduction to Signal Forms | Using the `form()` signal API |
| 19 | Submitting & Resetting | Handling form submission with `submit()` |
| 20 | Validation | Applying functional validators like `required` and `email` |
| 21 | Field State & Error Messages | Displaying validation feedback |