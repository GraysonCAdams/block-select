# Contributing to Block Select Plugin

Thank you for your interest in contributing to the Block Select plugin! We welcome contributions from the community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Architecture Overview](#architecture-overview)

## 🤝 Code of Conduct

Be respectful, constructive, and professional. We're all here to make great software together.

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Obsidian (latest version recommended)
- A test vault for development

### Setting Up Your Development Environment

1. **Fork the repository**
2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/block-select.git
   cd block-select
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

4. **Link to Obsidian Vault** (for testing)

   ```bash
   # Option 1: Symlink to your vault's plugins folder
   ln -s $(pwd) /path/to/your/vault/.obsidian/plugins/block-select

   # Option 2: Copy files after each build
   npm run build
   cp main.js manifest.json styles.css /path/to/vault/.obsidian/plugins/block-select/
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

This will watch for changes and rebuild automatically.

## 🔧 Development Workflow

### Project Structure

```
block-select/
├── src/
│   ├── header-detector.ts     # Header detection and text selection logic
│   ├── text-select-extension.ts # CodeMirror extension for icon widgets
│   ├── settings.ts            # Plugin settings interface
│   ├── settings-tab.ts        # Settings UI
│   ├── icon-picker-modal.ts  # Icon selection modal
│   └── lucide-icons.ts        # Icon helper functions
├── main.ts                    # Plugin entry point
├── manifest.json              # Plugin metadata
├── styles.css                 # Plugin styles
├── esbuild.config.mjs         # Build configuration
├── package.json
└── tsconfig.json
```

### Key Components

#### 1. Text Select Extension (`text-select-extension.ts`)

- CodeMirror 6 ViewPlugin for displaying icons beside headers
- Tracks mouse hover position for dynamic icon display
- Creates clickable widgets using Lucide icons
- Handles decoration placement at header line ends

#### 2. Header Detector (`header-detector.ts`)

- Detects markdown headers (H1-H6) using regex matching
- Finds text blocks under headers based on hierarchy
- Implements level-aware selection (stops at same or higher level headers)
- Provides cursor context detection for header ownership

#### 3. Icon Picker Modal (`icon-picker-modal.ts`)

- Searchable modal for browsing 1,000+ Lucide icons
- Popular icons section for quick access
- Grid layout with live icon previews
- Search filtering with performance optimization (limits to 100 results)

#### 4. Settings Tab (`settings-tab.ts`)

- Clean settings UI using Obsidian's native components
- Icon selection with live preview
- Command dropdown with all available Obsidian commands
- Toggle controls for header inclusion and auto-copy

#### 5. Lucide Icons (`lucide-icons.ts`)

- Creates SVG elements using DOM API (no innerHTML for security)
- Converts between kebab-case and PascalCase icon names
- Provides fallback icon for missing icons
- Exports popular icon suggestions

### Making Changes

1. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**

   - Follow the existing code style (TypeScript, 2-space indentation)
   - Add comments for complex logic
   - Update types as needed

3. **Test Your Changes**

   - Build the plugin: `npm run build`
   - Test in Obsidian manually
   - Verify no TypeScript errors: `npx tsc --noEmit`

4. **Commit Your Changes**

   ```bash
   git add .
   git commit -m "feat: add awesome feature"
   ```

   Use [Conventional Commits](https://www.conventionalcommits.org/):

   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

## 🧪 Testing

### Manual Testing Checklist

Before submitting a PR, test these scenarios:

#### Icon Display

- [ ] Icons appear beside headers when cursor is on header
- [ ] Icons appear when cursor is in content under header
- [ ] Icons follow mouse hover correctly
- [ ] Icons update when switching between notes
- [ ] No icons appear in non-markdown files

#### Text Selection

- [ ] Clicking icon selects correct text block
- [ ] Selection stops at next same-level header
- [ ] Selection includes/excludes header based on setting
- [ ] Works correctly for all header levels (H1-H6)
- [ ] No selection errors on empty content blocks

#### Icon Picker

- [ ] Icon picker modal opens from settings
- [ ] Search filter works correctly
- [ ] Popular icons section displays
- [ ] Selected icon updates immediately in editor
- [ ] Grid displays icons properly (no duplicates/missing)

#### Command Integration

- [ ] Command dropdown shows all available commands
- [ ] Selected command runs after text selection
- [ ] "None" option disables command execution
- [ ] Commands work with clipboard content

#### Settings

- [ ] Settings persist after restart
- [ ] All toggles work correctly
- [ ] Icon preview in settings matches editor
- [ ] Auto-copy to clipboard shows toast notification

#### Edge Cases

- [ ] Works with nested headers
- [ ] Works at document start and end
- [ ] No errors in empty documents
- [ ] No infinite loops or crashes
- [ ] Performance good in large documents

## 📤 Submitting Changes

### Pull Request Process

1. **Update Documentation**

   - Update README.md if you add features
   - Add comments to complex code
   - Update types if interfaces change

2. **Ensure Build Succeeds**

   ```bash
   npm run build
   npx tsc --noEmit
   ```

3. **Push Your Branch**

   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**

   - Go to GitHub and create a PR from your branch
   - Fill out the PR template
   - Link any related issues
   - Request review from maintainers

5. **Code Review**

   - Address any feedback from reviewers
   - Make requested changes
   - Push updates to your branch (PR auto-updates)

6. **Merge**
   - Once approved, maintainers will merge your PR
   - Your changes will be included in the next release

## 📝 Coding Standards

### TypeScript

- Use TypeScript's strict mode
- Define interfaces for all data structures
- Avoid `any` types where possible
- Use meaningful variable names

### Code Style

- 2-space indentation (tabs converted to spaces)
- Use semicolons
- Use single quotes for strings
- Trailing commas in multi-line objects/arrays
- Max line length: 120 characters

### Comments

- Add comments for complex logic
- Document all public methods with JSDoc
- Explain "why" not "what" when code isn't obvious

### Example

```typescript
/**
 * Calculates content hash for change detection
 * @param content - The memo content to hash
 * @returns MD5 hash as hex string
 */
export function calculateContentHash(content: string): string {
  return CryptoJS.MD5(content).toString();
}
```

## 🏗️ Architecture Overview

### Data Flow

```
User hovers over header → MouseMove Event → Text Select Extension
                                                     ↓
                                           Update Decorations
                                                     ↓
                                          Icon Widget Rendered
                                                     ↓
User clicks icon → handleBlockSelect → Header Detector
                                                ↓
                                      Find Text Block
                                                ↓
                                      Select Text in Editor
                                                ↓
                             Optional: Copy to Clipboard
                                                ↓
                              Optional: Execute Command
```

### Key Patterns

1. **CodeMirror Extensions**: ViewPlugin pattern for editor decorations
2. **DOM API**: All SVG creation uses secure DOM methods (no innerHTML)
3. **Event Handling**: Mouse listeners for hover tracking with cleanup
4. **State Management**: Settings persist via Obsidian's data API
5. **Level-Aware Selection**: Header hierarchy determines selection boundaries

### Selection Algorithm

The plugin determines selection boundaries by:

1. **Finding Active Line**: Cursor position or mouse hover (hover takes priority)
2. **Locating Owner Header**: Scan backwards to find the header that owns the line
3. **Calculating Block End**: Scan forward until next same-or-higher level header
4. **Creating Selection**: Use Obsidian Editor API to select the range

Example:

```markdown
# H1 ← Owner header (level 1)

Content here ← Part of H1 block

## H2 ← Sub-header (level 2), still in H1 block

More content ← Part of H2 block

# H1 ← Selection stops here (same level as owner)
```

## 🐛 Reporting Bugs

1. Check if the bug is already reported in [Issues](https://github.com/GraysonCAdams/block-select/issues)
2. If not, create a new issue with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Obsidian version and OS
   - Plugin version
   - Console errors (if any)

## 💡 Feature Requests

We love feature ideas! Please:

1. Check existing [Issues](https://github.com/GraysonCAdams/block-select/issues) first
2. Create a new issue describing:
   - The feature you'd like
   - Why it's useful
   - How it might work
   - Any examples from other tools

## 📚 Resources

- [Obsidian Plugin Developer Docs](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)
- [Lucide Icons Library](https://lucide.dev/icons/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [CodeMirror 6 Documentation](https://codemirror.net/docs/)

## ❓ Questions?

- Open a [Discussion](https://github.com/GraysonCAdams/block-select/discussions)
- Report issues on [GitHub Issues](https://github.com/GraysonCAdams/block-select/issues)

---

Thank you for contributing! 🎉
