import React, { Component } from "react";

class GlobalEditorDataClass {
	onTextChanged?: (text: string) => void;
	doSetText?: (text: string) => void;
	doInsertText?: (text: string) => void;
	setText(text: string) {
		// set the text
		this.doSetText && this.doSetText(text);
	}
	insertText(text: string) {
		// insert text at the cursor
		this.doInsertText && this.doInsertText(text);
	}
}

export const GlobalEditorData = new GlobalEditorDataClass();

type GlobalEditorDataComponentProps = {
	text: string;
	onChange: (text: string) => void;
};
export class GlobalEditorDataComponent extends Component<
	GlobalEditorDataComponentProps
> {
	render() {
		GlobalEditorData.onTextChanged = this.props.onChange;
		GlobalEditorData.setText(this.props.text);
		return null;
	}
}
