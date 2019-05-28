import React, { Component } from "react";
import { GlobalEditorData } from "./GlobalEditorData";

// A single tab. Contains text and an id.

type FileID = string;

type TabProps = {
	name: string;
	fileid: FileID;
};
export class Tab extends Component<TabProps, { text: string }> {
	// Register ourselves as the GlobalEditorComponent handler
	render() {
		return (
			<div
				onClick={() => {
					GlobalEditorData.setText(this.state.text);
				}}
			>
				Tab
			</div>
		);
	}
}
