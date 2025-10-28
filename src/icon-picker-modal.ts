import { Modal, App, Setting } from 'obsidian';
import { getAllIconNames, createIconElement, POPULAR_ICONS } from './lucide-icons';

export class IconPickerModal extends Modal {
	private onSelectIcon: (iconName: string) => void;
	private currentIcon: string;

	constructor(app: App, currentIcon: string, onSelectIcon: (iconName: string) => void) {
		super(app);
		this.currentIcon = currentIcon;
		this.onSelectIcon = onSelectIcon;
	}

	onOpen() {
		const { contentEl } = this;
		
		contentEl.empty();
		contentEl.addClass('block-select-icon-picker-modal');
		
		// Title
		contentEl.createEl('h2', { text: 'Choose Icon' });
		
		// Search input
		const searchContainer = contentEl.createDiv({ cls: 'block-select-icon-search' });
		const searchInput = searchContainer.createEl('input', {
			type: 'text',
			placeholder: 'Search icons...',
			cls: 'block-select-icon-search-input'
		});
		
		// Popular icons section
		const popularSection = contentEl.createDiv({ cls: 'block-select-icon-section' });
		popularSection.createEl('h3', { text: 'Popular' });
		const popularGrid = popularSection.createDiv({ cls: 'block-select-icon-grid' });
		
		// All icons section
		const allSection = contentEl.createDiv({ cls: 'block-select-icon-section' });
		allSection.createEl('h3', { text: 'All Icons' });
		const allGrid = allSection.createDiv({ cls: 'block-select-icon-grid' });
		
		const allIcons = getAllIconNames();
		
		// Render popular icons
		const renderPopularIcons = () => {
			popularGrid.empty();
			POPULAR_ICONS.forEach(iconName => {
				this.createIconButton(popularGrid, iconName);
			});
		};
		
		// Render all icons (with search filter)
		const renderAllIcons = (filter: string = '') => {
			allGrid.empty();
			const filtered = filter
				? allIcons.filter(name => name.toLowerCase().includes(filter.toLowerCase()))
				: allIcons;
			
			filtered.slice(0, 100).forEach(iconName => { // Limit to 100 for performance
				this.createIconButton(allGrid, iconName);
			});
			
			if (filtered.length > 100) {
				const moreText = allGrid.createDiv({ cls: 'block-select-icon-more' });
				moreText.setText(`Showing first 100 of ${filtered.length} icons. Refine your search to see more.`);
			}
		};
		
		// Search functionality
		searchInput.addEventListener('input', () => {
			const filter = searchInput.value;
			renderAllIcons(filter);
			
			// Hide popular section when searching - use CSS class
			if (filter) {
				popularSection.addClass('is-hidden');
			} else {
				popularSection.removeClass('is-hidden');
			}
		});
		
		// Initial render
		renderPopularIcons();
		renderAllIcons();
		
		// Focus search input
		searchInput.focus();
	}
	
	private createIconButton(container: HTMLElement, iconName: string) {
		const button = container.createDiv({ cls: 'block-select-icon-button' });
		
		if (iconName === this.currentIcon) {
			button.addClass('selected');
		}
		
		const iconContainer = button.createDiv({ cls: 'block-select-icon-preview' });
		// Use DOM API instead of innerHTML
		const svgElement = createIconElement(iconName);
		iconContainer.appendChild(svgElement);
		
		const nameLabel = button.createDiv({ cls: 'block-select-icon-name' });
		nameLabel.setText(iconName);
		
		button.addEventListener('click', () => {
			this.onSelectIcon(iconName);
			this.close();
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
