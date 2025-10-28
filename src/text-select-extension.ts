import { EditorView, Decoration, DecorationSet, ViewPlugin, ViewUpdate, WidgetType } from '@codemirror/view';
import { Range } from '@codemirror/state';
import { BlockSelectSettings } from './settings';
import { getHeaderLevel, getTextBlockUnderHeader } from './header-detector';
import { createIconElement } from './lucide-icons';

/**
 * Widget that displays the text select icon beside a header
 */
class TextSelectWidget extends WidgetType {
	constructor(
		private headerLine: number,
		private onSelect: (headerLine: number) => void,
		private iconName: string
	) {
		super();
	}

	toDOM(view: EditorView): HTMLElement {
		const icon = document.createElement('span');
		icon.className = 'block-select-icon';
		icon.setAttribute('aria-label', 'Select text under this header');
		icon.setAttribute('title', 'Select text under this header');
		icon.contentEditable = 'false';
		
		// Use the selected Lucide icon - create SVG using DOM API
		const svgElement = createIconElement(this.iconName);
		icon.appendChild(svgElement);
		
		icon.addEventListener('mousedown', (e) => {
			e.preventDefault();
			e.stopPropagation();
		});
		
		icon.addEventListener('click', (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.onSelect(this.headerLine);
		});
		
		return icon;
	}

	ignoreEvent(event: Event): boolean {
		// Ignore all events to prevent editor interference
		return true;
	}

	eq(other: TextSelectWidget): boolean {
		return other.headerLine === this.headerLine && other.iconName === this.iconName;
	}
}

/**
 * Helper to get Obsidian Editor from CodeMirror EditorView
 */
function getEditorFromView(view: EditorView): any {
	// Try multiple methods to get the editor
	const cmEditor = (view as any).cm?.editor;
	if (cmEditor) return cmEditor;
	
	const stateEditor = (view.state as any).editor;
	if (stateEditor) return stateEditor;
	
	// Try to find it in the DOM
	const editorEl = (view.dom as any).closest('.cm-editor');
	if (editorEl && (editorEl as any).editor) {
		return (editorEl as any).editor;
	}
	
	return null;
}

/**
 * Creates the CodeMirror extension for displaying text select icons
 */
export function createTextSelectExtension(
	settings: BlockSelectSettings,
	onSelectBlock: (view: EditorView, headerLine: number) => void
) {
	let hoveredLine: number | null = null;

	return ViewPlugin.fromClass(
		class {
			decorations: DecorationSet;
			private mouseListener: ((e: MouseEvent) => void) | null = null;

			constructor(view: EditorView) {
				this.decorations = this.buildDecorations(view);
				this.setupMouseListener(view);
			}

			setupMouseListener(view: EditorView) {
				this.mouseListener = (e: MouseEvent) => {
					const pos = view.posAtCoords({ x: e.clientX, y: e.clientY });
					if (pos !== null) {
						const line = view.state.doc.lineAt(pos);
						const lineNumber = line.number - 1; // Convert to 0-based
						
						if (lineNumber !== hoveredLine) {
							hoveredLine = lineNumber;
							this.decorations = this.buildDecorations(view);
							view.update([]);
						}
					}
				};

				view.dom.addEventListener('mousemove', this.mouseListener);
			}

			destroy() {
				if (this.mouseListener) {
					// Remove listener from the view's DOM
					const dom = document.querySelector('.cm-editor');
					if (dom) {
						dom.removeEventListener('mousemove', this.mouseListener);
					}
				}
			}

			update(update: ViewUpdate) {
				if (update.docChanged || update.selectionSet || update.viewportChanged) {
					// Reset hoveredLine if document changed (e.g., switching notes)
					if (update.docChanged) {
						hoveredLine = null;
					}
					this.decorations = this.buildDecorations(update.view);
				}
			}

			buildDecorations(view: EditorView): DecorationSet {
				const decorations: Range<Decoration>[] = [];
				const doc = view.state.doc;
				const selection = view.state.selection.main;
				const cursorLine = doc.lineAt(selection.head).number - 1; // Convert to 0-based

				// Parse the document directly
				const lines: string[] = [];
				for (let i = 1; i <= doc.lines; i++) {
					lines.push(doc.line(i).text);
				}

				// Safety check: ensure we have lines
				if (lines.length === 0) {
					return Decoration.set([]);
				}

				// Determine which line to show the icon for
				// Priority: hovered line > cursor line
				const activeLine = hoveredLine !== null ? hoveredLine : cursorLine;

				// Safety check: ensure activeLine is within bounds
				if (activeLine < 0 || activeLine >= lines.length) {
					return Decoration.set([]);
				}

				// Find which header should show the icon
				let targetHeaderLine: number | null = null;
				const activeLineText = lines[activeLine];
				const headerLevel = getHeaderLevel(activeLineText);

				if (headerLevel !== null) {
					// Active line is a header
					targetHeaderLine = activeLine;
				} else {
					// Check if active line is in a content block under a header
					// Scan backwards to find the owning header
					for (let i = activeLine; i >= 0; i--) {
						const line = lines[i];
						// Safety check: ensure line exists
						if (!line) continue;
						
						const level = getHeaderLevel(line);
						
						if (level !== null) {
							// Found a header, check if active line is in its block
							let blockEnd = lines.length - 1;
							for (let j = i + 1; j < lines.length; j++) {
								const nextLine = lines[j];
								// Safety check: ensure line exists
								if (!nextLine) continue;
								
								const nextLevel = getHeaderLevel(nextLine);
								if (nextLevel !== null && nextLevel <= level) {
									blockEnd = j - 1;
									break;
								}
							}
							
							if (activeLine >= i + 1 && activeLine <= blockEnd) {
								targetHeaderLine = i;
							}
							break;
						}
					}
				}

				// If we found a target header, add the decoration
				if (targetHeaderLine !== null && targetHeaderLine >= 0 && targetHeaderLine < doc.lines) {
					const line = doc.line(targetHeaderLine + 1); // Convert back to 1-based
					
					// Create widget at the end of the header line
					const widget = Decoration.widget({
						widget: new TextSelectWidget(targetHeaderLine, (headerLine) => {
							onSelectBlock(view, headerLine);
						}, settings.iconName),
						side: 1
					});

					decorations.push(widget.range(line.to));
				}

				return Decoration.set(decorations);
			}
		},
		{
			decorations: (v) => v.decorations
		}
	);
}
