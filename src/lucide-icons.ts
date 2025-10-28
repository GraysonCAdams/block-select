import { icons } from 'lucide';

/**
 * Convert kebab-case to PascalCase for Lucide icon names
 */
function kebabToPascal(str: string): string {
	return str.split('-').map(word => 
		word.charAt(0).toUpperCase() + word.slice(1)
	).join('');
}

/**
 * Convert PascalCase to kebab-case for display
 */
function pascalToKebab(str: string): string {
	return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
}

/**
 * Get list of all available Lucide icon names (in kebab-case)
 */
export function getAllIconNames(): string[] {
	return Object.keys(icons).map(pascalToKebab).sort();
}

/**
 * Create an SVG element for a Lucide icon by name (accepts kebab-case)
 * Uses DOM API instead of innerHTML for security
 */
export function createIconElement(iconName: string): SVGElement {
	// Convert kebab-case to PascalCase to match Lucide's icon names
	const pascalName = kebabToPascal(iconName);
	const icon = icons[pascalName as keyof typeof icons];
	
	// Create SVG element using DOM API
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
	svg.setAttribute('width', '16');
	svg.setAttribute('height', '16');
	svg.setAttribute('viewBox', '0 0 24 24');
	svg.setAttribute('fill', 'none');
	svg.setAttribute('stroke', 'currentColor');
	svg.setAttribute('stroke-width', '2');
	svg.setAttribute('stroke-linecap', 'round');
	svg.setAttribute('stroke-linejoin', 'round');
	
	if (!icon) {
		// Create default file-text icon if not found
		const paths = [
			'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z',
			'M14 2v4a2 2 0 0 0 2 2h4',
			'M10 9H8',
			'M16 13H8',
			'M16 17H8'
		];
		paths.forEach(d => {
			const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			path.setAttribute('d', d);
			svg.appendChild(path);
		});
		return svg;
	}
	
	// Process icon elements using DOM API
	icon.forEach((element: any) => {
		if (Array.isArray(element)) {
			const [tag, attrs] = element;
			const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
			
			// Set attributes using DOM API
			Object.entries(attrs || {}).forEach(([key, value]) => {
				el.setAttribute(key, value as string);
			});
			
			svg.appendChild(el);
		}
	});
	
	return svg;
}

/**
 * Popular icon suggestions for quick access
 */
export const POPULAR_ICONS = [
	'file-text',
	'text',
	'align-left',
	'list',
	'copy',
	'clipboard',
	'check-square',
	'mouse-pointer-click',
	'hand',
	'pointer',
	'square-check-big',
	'square-mouse-pointer'
];
