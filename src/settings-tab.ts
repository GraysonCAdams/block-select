import { App, PluginSettingTab, Setting } from 'obsidian';
import type BlockSelectPlugin from '../main';
import { IconPickerModal } from './icon-picker-modal';
import { createIconElement } from './lucide-icons';

export class BlockSelectSettingTab extends PluginSettingTab {
	plugin: BlockSelectPlugin;

	constructor(app: App, plugin: BlockSelectPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Block Select Settings' });

		// Add usage tips at the top
		const tipsEl = containerEl.createDiv({ cls: 'block-select-usage-tips' });
		tipsEl.createSpan({ 
			text: 'The selection icon appears beside headers when you hover over them or their content. Click to select text up to the next same-level header. Combine with commands like Copy or Extract for quick workflows.',
			cls: 'block-select-usage-tips-text'
		});

		// Icon selection
		new Setting(containerEl)
			.setName('Selection icon')
			.setDesc('Choose the icon that appears beside headers.')
			.addButton(button => {
				const updateButtonIcon = () => {
					button.buttonEl.empty();
					const iconContainer = button.buttonEl.createSpan({ cls: 'block-select-icon-preview-button' });
					// Use DOM API instead of innerHTML
					const svgElement = createIconElement(this.plugin.settings.iconName);
					iconContainer.appendChild(svgElement);
					button.buttonEl.createSpan({ text: ' Change Icon' });
				};
				
				updateButtonIcon();
				
				button.onClick(() => {
					const modal = new IconPickerModal(
						this.app,
						this.plugin.settings.iconName,
						async (iconName: string) => {
							this.plugin.settings.iconName = iconName;
							await this.plugin.saveSettings();
							updateButtonIcon();
						}
					);
					modal.open();
				});
			});

		// Include header in selection toggle
		new Setting(containerEl)
			.setName('Include header in selection')
			.setDesc('When enabled, the header itself will be included in the text selection. When disabled, only the content under the header is selected.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.includeHeader)
				.onChange(async (value) => {
					this.plugin.settings.includeHeader = value;
					await this.plugin.saveSettings();
				}));

		// Command to run after selection - Clean dropdown
		new Setting(containerEl)
			.setName('Run command after selection')
			.setDesc('Optionally run an Obsidian command immediately after selecting text.')
			.addDropdown(dropdown => {
				// Get all available commands
				const commands = (this.app as any).commands?.commands;
				const allCommands: Array<{ id: string; name: string }> = [];
				
				// Add empty option first
				dropdown.addOption('', 'None');
				
				if (commands) {
					Object.entries(commands).forEach(([id, cmd]: [string, any]) => {
						allCommands.push({
							id,
							name: cmd.name || id
						});
					});
					// Sort alphabetically by name
					allCommands.sort((a, b) => a.name.localeCompare(b.name));
					
					// Add all commands to dropdown
					allCommands.forEach(cmd => {
						dropdown.addOption(cmd.id, cmd.name);
					});
				}
				
				// Set current value
				dropdown.setValue(this.plugin.settings.commandAfterSelection || '');
				
				// Handle changes
				dropdown.onChange(async (value) => {
					this.plugin.settings.commandAfterSelection = value;
					await this.plugin.saveSettings();
				});
			});

		// Auto-copy to clipboard toggle
		new Setting(containerEl)
			.setName('Auto-copy to clipboard')
			.setDesc('Automatically copy the selected text to clipboard when you click the selection icon.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.autoCopyToClipboard)
				.onChange(async (value) => {
					this.plugin.settings.autoCopyToClipboard = value;
					await this.plugin.saveSettings();
				}));
	}
}
