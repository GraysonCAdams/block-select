import { Plugin, MarkdownView, Notice } from 'obsidian';
import { EditorView } from '@codemirror/view';
import { BlockSelectSettings, DEFAULT_SETTINGS } from './src/settings';
import { BlockSelectSettingTab } from './src/settings-tab';
import { createTextSelectExtension } from './src/text-select-extension';
import { selectTextBlock } from './src/header-detector';
import { Extension } from '@codemirror/state';

export default class BlockSelectPlugin extends Plugin {
	settings: BlockSelectSettings;
	private textSelectExtension: Extension | null = null;
	private isSelecting: boolean = false;

	async onload() {
		await this.loadSettings();
		this.registerTextSelectExtension();
		this.addSettingTab(new BlockSelectSettingTab(this.app, this));
		console.log('Block Select plugin loaded');
	}

	onunload() {
		console.log('Block Select plugin unloaded');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.refreshExtension();
	}

	registerTextSelectExtension() {
		if (this.textSelectExtension) {
			return;
		}
		this.textSelectExtension = createTextSelectExtension(
			this.settings,
			(view: EditorView, headerLine: number) => {
				this.handleBlockSelect(view, headerLine);
			}
		);
		this.registerEditorExtension(this.textSelectExtension);
	}

	refreshExtension() {
		this.app.workspace.iterateAllLeaves(leaf => {
			if (leaf.view instanceof MarkdownView) {
				const editor = leaf.view.editor;
				if (editor) {
					const cursor = editor.getCursor();
					editor.setCursor(cursor);
				}
			}
		});
	}

	async handleBlockSelect(view: EditorView, headerLine: number) {
		// Prevent recursive calls
		if (this.isSelecting) {
			console.log('Already selecting, skipping...');
			return;
		}
		
		this.isSelecting = true;
		
		try {
			// Get the active markdown view and its editor
			const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (!activeView) {
				console.error('No active markdown view');
				return;
			}
			
			const editor = activeView.editor;
			if (!editor) {
				console.error('Could not get editor from active view');
				return;
			}
			
			const success = selectTextBlock(editor, headerLine, this.settings.includeHeader);
			if (!success) {
				console.log('No content to select under this header');
				return;
			}

			// Auto-copy to clipboard if enabled - WAIT for it to complete
			if (this.settings.autoCopyToClipboard) {
				const selectedText = editor.getSelection();
				if (selectedText) {
					try {
						await navigator.clipboard.writeText(selectedText);
						new Notice('✓ Copied to clipboard', 2000);
					} catch (err) {
						console.error('Failed to copy to clipboard:', err);
						new Notice('✗ Failed to copy to clipboard', 2000);
					}
				}
			}

			// Run command if configured - AFTER clipboard copy completes
			if (this.settings.commandAfterSelection) {
				// Use setTimeout to avoid blocking and potential loops
				setTimeout(() => {
					(this.app as any).commands?.executeCommandById(this.settings.commandAfterSelection);
				}, 50);
			}
		} finally {
			// Reset the flag after a short delay
			setTimeout(() => {
				this.isSelecting = false;
			}, 100);
		}
	}
}
