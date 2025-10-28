# Block Select Plugin for Obsidian

[![Build Status](https://github.com/GraysonCAdams/block-select/workflows/Build%20CI/badge.svg)](https://github.com/GraysonCAdams/block-select/actions)
[![Release](https://img.shields.io/github/v/release/GraysonCAdams/block-select)](https://github.com/GraysonCAdams/block-select/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Enhance your Obsidian writing experience with smart text selection. This plugin adds clickable text icons beside headers that intelligently select all content under that header until the next header of the same level.

## ✨ Features

### � Smart Header-Based Text Selection

- **Intelligent Block Detection**: Automatically detects content blocks under headers
- **Visual Text Icons**: Lucide text icons appear beside headers when cursor is nearby
- **One-Click Selection**: Click the icon to select all content until the next header of the same level
- **Smart Cursor Detection**: Icons appear when cursor is on the header or in its content block

### ⚙️ Flexible Selection Options

- **Customizable Icons**: Choose from 1,000+ Lucide icons with searchable grid picker
- **Header Inclusion Toggle**: Choose whether to include the header in the selection (defaults to text-only)
- **Command Integration**: Optionally run any Obsidian command after text selection
- **Auto-Copy to Clipboard**: Automatically copy selected text with a confirmation toast notification
- **Tooltip Guidance**: Hover tooltips clearly explain the selection behavior

### � Precise Content Targeting

- **Level-Aware Selection**: Respects header hierarchy (H1, H2, H3, etc.)
- **Block Boundaries**: Stops selection at the next header of the same or higher level
- **Clean Selection**: Selects complete paragraphs and content blocks without artifacts

## 🚀 Installation

### From Community Plugins (Coming Soon)

1. Open Obsidian Settings
2. Go to Community Plugins and browse
3. Search for "Block Select"
4. Install and enable

### Manual Installation

1. Download the latest release from the [releases page](https://github.com/GraysonCAdams/block-select/releases/latest)
2. Extract `main.js`, `manifest.json`, and `styles.css` to your vault's `.obsidian/plugins/block-select/` folder
3. Enable the plugin in Obsidian's Community Plugins settings

## 🛠️ Development Setup

#### For Development

```bash
# Clone this repository to your vault's plugins folder
cd /path/to/your/vault/.obsidian/plugins/
git clone https://github.com/GraysonCAdams/block-select.git
cd block-select

# Install dependencies
npm install

# Build the plugin
npm run build

# For development with auto-rebuild
npm run dev
```

## ⚙️ Configuration

### Plugin Settings

1. Open Obsidian Settings
2. Go to **Community Plugins** → **Block Select**
3. Configure your preferences:
   - **Include Header in Selection**: Toggle whether the header itself is included when selecting (defaults to false)
   - **Run Command After Selection**: Optionally choose an Obsidian command to execute after each text selection

## 📖 Usage

### Selecting Text Blocks

1. **Navigate to a Header**: Place your cursor on any header (H1, H2, H3, etc.) or in the content block beneath it
2. **See the Text Icon**: A text selection icon will appear beside the header
3. **Click to Select**: Click the icon to select all content from after the header until the next header of the same level
4. **Optional Command**: If configured, your chosen Obsidian command will run automatically after selection

### Icon Behavior

- **Visibility**: The text icon appears when:
  - Your cursor is positioned on a header line
  - Your cursor is anywhere in the content block under that header
- **Selection Range**: The selection includes:
  - All paragraphs, lists, and content after the header
  - Stops at the next header of the same or higher level
  - Optionally includes the header itself (if enabled in settings)

### Example Selection

```markdown
## My Header [📄] <- Icon appears here

This paragraph will be selected.

So will this one.

- And this list item
- And this one too

### Sub-header (not selected)

This content belongs to the sub-header.

## Next Header <- Selection stops here
```

### Tooltip Help

- Hover over any text selection icon to see: **"Select text under this header"**
- The cursor changes to a pointer when hovering over clickable icons

## � Use Cases

Perfect for writers, researchers, and note-takers who want to:

### Content Organization

- **Section Editing**: Quickly select entire sections for moving, copying, or formatting
- **Content Review**: Easily highlight complete thoughts or topics for review
- **Bulk Operations**: Select large content blocks for deletion, formatting, or restructuring

### Writing Workflows

- **Draft Management**: Select complete sections to move between documents
- **Content Formatting**: Apply formatting to entire logical sections at once
- **Research Notes**: Quickly select and copy complete research sections

### Integration Examples

- **Copy to New Note**: Select a section and use "Extract current selection" command
- **Format as Quote**: Select content and apply block quote formatting
- **Move to Archive**: Select completed sections for archival

## 📋 Settings Reference

### Appearance

- **Selection Icon**:
  - _Default_: `file-text` (document icon)
  - _Options_: Choose from 1,000+ Lucide icons
  - _Features_:
    - **Searchable grid**: Type to filter icons by name
    - **Popular section**: Quick access to common selection icons
    - **Live preview**: See icons as you browse
    - **Instant update**: Icon changes immediately in editor
  - _Popular choices_: `file-text`, `text`, `align-left`, `list`, `copy`, `clipboard`, `check-square`, `hand`, `pointer`

### Selection Behavior

- **Include Header in Selection**:
  - _Default_: `false` (select only the content under the header)
  - _When enabled_: Include the header line itself in the selection
  - _Use case_: Enable when you want to move or copy entire sections including titles

### Command Integration

- **Run Command After Selection**:
  - _Default_: None (just select the text)
  - _Options_: Type to search for any available Obsidian command
  - _Popular choices_:
    - "Copy to clipboard"
    - "Extract current selection"
    - "Toggle blockquote"
    - "Move line up/down"

### Automation

- **Auto-Copy to Clipboard**:
  - _Default_: `false` (no automatic copying)
  - _When enabled_: Automatically copies the selected text to clipboard when you click the selection icon
  - _Feedback_: Shows a toast notification "✓ Copied to clipboard" when successful
  - _Use case_: Perfect for quickly grabbing content to paste elsewhere without manually copying

## 🔧 Troubleshooting

### Icons Not Appearing

1. Make sure the plugin is enabled in Community Plugins
2. Check that you're in a Markdown file (`.md` extension)
3. Ensure your cursor is on a header line or in content below a header
4. Try switching to a different pane and back to refresh the view

### Selection Issues

1. **Selection seems wrong**: Headers must follow Markdown syntax (`#`, `##`, `###`, etc.)
2. **Nothing selected**: Make sure there's content between the header and the next header of the same level
3. **Too much selected**: Check for proper header hierarchy - the plugin stops at same or higher level headers

### Performance

- **Large documents**: The plugin efficiently detects headers without performance impact
- **Many headers**: Icons only appear for the currently relevant header near your cursor
- **Real-time updates**: Icon visibility updates immediately as you move your cursor

### Commands Not Running

1. Verify the command is available in your Obsidian installation
2. Check that the command can run with the current selection
3. Some commands may require specific contexts or selected content types

## 🔒 Privacy & Security

- **Local Processing**: All text analysis and header detection happens locally on your device
- **No Data Transmission**: Plugin doesn't send any data to external servers
- **No Data Collection**: Plugin doesn't collect or store usage analytics
- **Settings Storage**: Settings are stored locally in Obsidian's data directory
- **Minimal Permissions**: Plugin only needs access to editor content for text selection

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with clear commit messages
4. Ensure the build succeeds (`npm run build`)
5. Test your changes thoroughly
6. Submit a pull request

## 📚 Resources

- [Report Issues](https://github.com/GraysonCAdams/block-select/issues)
- 🚀 [Feature Requests](https://github.com/GraysonCAdams/block-select/issues/new)
- 📦 [Releases](https://github.com/GraysonCAdams/block-select/releases)

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🎯 Roadmap

- [ ] Support for custom icon selection
- [ ] Keyboard shortcut alternatives
- [ ] Multi-selection support for multiple headers
- [ ] Custom selection rules and patterns

## 📈 Changelog

See [Releases](https://github.com/GraysonCAdams/block-select/releases) for version history and detailed changes.

---

Made with ❤️ for the Obsidian community.
