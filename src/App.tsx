import React, { Component } from "react";
import {parse, PositionedError} from "scpl";
import logo from "./logo.svg";
import "./App.css";

import testshortcut from "./testshortcut.json";

import ace from "brace";
import "./ace/mode-scpl";
import AceEditor from "react-ace";

import ShortcutPreview from "shortcut-preview";

console.log(ace, ace.Range);

let timeout: NodeJS.Timeout;

class App extends Component<{}, { fileValue: string, shortcutData: any, annotations: Array<ace.Annotation>, markers: Array<{startRow: number, endRow: number, startCol: number, endCol: number, className: string, type: string}> }> {
	constructor(props: Readonly<{}>) {
		super(props);
		this.state = {fileValue: "ShowResult \"Hello ScPL\"", shortcutData: testshortcut, annotations: [], markers: []};
	}
	render() {
		return (
			<div className="App">
				<div className="split">
					<div className="splitItem">
						<AceEditor
							mode="scpl"
							theme="github"
							onChange={this.onChange.bind(this)}
							name="ace_editor"
							editorProps={{$blockScrolling: true}}
							value={this.state.fileValue || ""}
							annotations={this.state.annotations}
							markers={this.state.markers}
						/>
					</div>
					<div className="splitItem scroll">
						<div>{this.state.shortcutData[0].WFWorkflowActions.length} actions</div>
						<ShortcutPreview data={this.state.shortcutData} />
					</div>
				</div>
			</div>
		);
	}
	onChange(text: string) {
		if(timeout) {clearTimeout(timeout);}
		timeout = setTimeout(() => this.onChangeLimited(text), 100);
	}
	onChangeLimited(text: string) {
		// parse
		let output: {shortcutjson: any, shortcutplist: Buffer};
		try{
			output = parse(text, { make: ["shortcutjson", "shortcutplist"] });
		}catch(er) {
			console.log(er.message);
			if(!(er instanceof PositionedError)) {throw new Error("Not positioned");}
			this.setState({
				fileValue: text,
				annotations: [{
					row: er.start[0] - 1,
					column: er.start[1] - 1,
					text: er.message, // Or the Json reply from the parser
					type: "error" // also warning and information
				}], markers: [{
					startRow: er.start[0] - 1,
					endRow: er.end[0] - 1,
					startCol: er.start[1] - 1,
					endCol: er.end[1] - 1,
					className: "ace_active-line error", type: "background"
				}]});
			return;
		}
		const {shortcutjson, shortcutplist} = output;
		this.setState({fileValue: text, shortcutData: shortcutjson, annotations: [], markers: []});	
	}
}

export default App;
