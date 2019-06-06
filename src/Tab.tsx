import React, { Component } from "react";
import { GlobalEditorDataComponent } from "./GlobalEditorData";
import ace from "brace";

// A single tab. Contains text and an id.

type FileID = string;

type TabProps = {
	name: string;
	fileid: FileID;
	selected: boolean;
	onSelect: () => void;
};
export class Tab extends Component<TabProps, { session: ace.IEditSession }> {
	constructor(props: Readonly<TabProps>) {
		super(props);
		this.state = { session: new ace.EditSession("", "scpl") };
	}
	// Register ourselves as the GlobalEditorComponent handler
	render() {
		return (
			<div
				onClick={() => {
					this.props.onSelect();
				}}
			>
				{this.props.name}
				{this.props.selected ? (
					<GlobalEditorDataComponent
						text={this.state.text}
						onChange={text => {
							this.setState({ text });
						}}
					/>
				) : null}
			</div>
		);
	}
}
