export interface BlockSelectSettings {
	includeHeader: boolean;
	commandAfterSelection: string;
	autoCopyToClipboard: boolean;
	iconName: string;
}

export const DEFAULT_SETTINGS: BlockSelectSettings = {
	includeHeader: false,
	commandAfterSelection: '',
	autoCopyToClipboard: false,
	iconName: 'file-text'
};
