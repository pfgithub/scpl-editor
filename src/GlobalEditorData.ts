class GlobalEditorDataClass {
	onSetText?: (text: string) => void;
	onInsertText?: (text: string) => void;
	setText(text: string) {
		// set the text
		this.onSetText && this.onSetText(text);
	}
	insertText(text: string) {
		// insert text at the cursor
		this.onInsertText && this.onInsertText(text);
	}
}

export const GlobalEditorData = new GlobalEditorDataClass();
