import React, { Component } from "react";
import {parse} from "scpl";
import logo from "./logo.svg";
import "./App.css";

import testshortcut from "./testshortcut.json";

import brace from "brace";
import "./ace/mode-scpl";
import AceEditor from "react-ace";

import ShortcutPreview from "shortcut-preview";

class App extends Component<{}, { fileValue: string, shortcutData: any }> {
	constructor(props: Readonly<{}>) {
		super(props);
		this.state = {fileValue: "text \"hello world\"", shortcutData: testshortcut};
	}
	render() {
		console.log("SHORTCUT DATA IS ", this.state.shortcutData);
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
						/>
					</div>
					<div className="splitItem scroll">
						<div>{this.state.shortcutData[0].WFWorkflowActions.length} actions</div>
						<ShortcutPreview data={this.state.shortcutData} key={Math.floor(Math.random() * 1000)} />
					</div>
				</div>
			</div>
		);
	}
	onChange(text: string) {
		// parse
		let output: {shortcutjson: any, shortcutplist: Buffer};
		try{
			output = parse(text, { make: ["shortcutjson", "shortcutplist"] });
		}catch(er) {
			console.log(er.message);
			return;
		}
		const {shortcutjson, shortcutplist} = output;
		this.setState({shortcutData: shortcutjson, fileValue: text});
	}
}

export default App;
