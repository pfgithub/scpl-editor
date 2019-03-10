import React, { Component } from "react";
import {parse} from "scpl";
import logo from "./logo.svg";
import "./App.css";

import * as testshortcut from "./testshortcut.json";

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
		return (
			<div className="App">
				<AceEditor
					mode="scpl"
					theme="github"
					onChange={this.onChange.bind(this)}
					name="ace_editor"
					editorProps={{$blockScrolling: true}}
					value={this.state.fileValue || ""}
				/>
				<ShortcutPreview data={this.state.shortcutData} />
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
