import { Editor } from 'obsidian';

export interface HeaderInfo {
	line: number;
	level: number;
	text: string;
}

export interface TextBlock {
	headerLine: number;
	startLine: number;
	endLine: number;
	headerLevel: number;
}

/**
 * Detects if a line is a header and returns its level
 * @param line The line text to check
 * @returns The header level (1-6) or null if not a header
 */
export function getHeaderLevel(line: string): number | null {
	// Safety check: ensure line is defined and is a string
	if (!line || typeof line !== 'string') {
		return null;
	}
	
	const match = line.match(/^(#{1,6})\s+/);
	return match ? match[1].length : null;
}

/**
 * Finds all headers in the editor
 * @param editor The Obsidian editor instance
 * @returns Array of header information
 */
export function findAllHeaders(editor: Editor): HeaderInfo[] {
	const headers: HeaderInfo[] = [];
	const lineCount = editor.lineCount();
	
	for (let i = 0; i < lineCount; i++) {
		const line = editor.getLine(i);
		const level = getHeaderLevel(line);
		
		if (level !== null) {
			headers.push({
				line: i,
				level: level,
				text: line.replace(/^#{1,6}\s+/, '').trim()
			});
		}
	}
	
	return headers;
}

/**
 * Finds the header that owns a given line number
 * @param editor The Obsidian editor instance
 * @param lineNumber The line number to check
 * @returns The header info or null if no header found
 */
export function findOwningHeader(editor: Editor, lineNumber: number): HeaderInfo | null {
	const headers = findAllHeaders(editor);
	
	// Find the last header before or at the current line
	let owningHeader: HeaderInfo | null = null;
	
	for (const header of headers) {
		if (header.line <= lineNumber) {
			owningHeader = header;
		} else {
			break;
		}
	}
	
	return owningHeader;
}

/**
 * Gets the text block under a header (everything until the next header of same or higher level)
 * @param editor The Obsidian editor instance
 * @param headerLine The line number of the header
 * @returns The text block information
 */
export function getTextBlockUnderHeader(editor: Editor, headerLine: number): TextBlock | null {
	const headerText = editor.getLine(headerLine);
	const headerLevel = getHeaderLevel(headerText);
	
	if (headerLevel === null) {
		return null;
	}
	
	const lineCount = editor.lineCount();
	const startLine = headerLine + 1; // Content starts after the header
	let endLine = lineCount - 1; // Default to end of document
	
	// Find the next header of same or higher level
	for (let i = startLine; i < lineCount; i++) {
		const line = editor.getLine(i);
		const level = getHeaderLevel(line);
		
		if (level !== null && level <= headerLevel) {
			// Found a header of same or higher level
			endLine = i - 1;
			break;
		}
	}
	
	return {
		headerLine,
		startLine,
		endLine,
		headerLevel
	};
}

/**
 * Checks if the cursor is within a text block (on the header or in the content)
 * @param editor The Obsidian editor instance
 * @param cursorLine The current cursor line
 * @returns The header info if cursor is in a block, null otherwise
 */
export function getCursorHeaderContext(editor: Editor, cursorLine: number): HeaderInfo | null {
	const lineText = editor.getLine(cursorLine);
	const level = getHeaderLevel(lineText);
	
	// If cursor is on a header, return it
	if (level !== null) {
		return {
			line: cursorLine,
			level: level,
			text: lineText.replace(/^#{1,6}\s+/, '').trim()
		};
	}
	
	// Otherwise, find the header that owns this line
	return findOwningHeader(editor, cursorLine);
}

/**
 * Selects the text block under a header
 * @param editor The Obsidian editor instance
 * @param headerLine The line number of the header
 * @param includeHeader Whether to include the header in the selection
 */
export function selectTextBlock(editor: Editor, headerLine: number, includeHeader: boolean): boolean {
	const block = getTextBlockUnderHeader(editor, headerLine);
	
	if (!block) {
		return false;
	}
	
	// If there's no content under the header, don't select anything
	if (block.startLine > block.endLine) {
		return false;
	}
	
	const fromLine = includeHeader ? block.headerLine : block.startLine;
	const toLine = block.endLine;
	
	// Get the character positions
	const fromCh = 0;
	const toCh = editor.getLine(toLine).length;
	
	// Set the selection
	editor.setSelection(
		{ line: fromLine, ch: fromCh },
		{ line: toLine, ch: toCh }
	);
	
	return true;
}
