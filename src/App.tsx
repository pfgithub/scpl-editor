import React, { Component } from "react";
import {parse, PositionedError} from "scpl";
import logo from "./logo.svg";
import "./App.css";

import testshortcut from "./testshortcut.json";

import ace from "brace";
import "./ace/mode-scpl";
import AceEditor from "react-ace";

import ShortcutPreview from "shortcut-preview";

let timeout: NodeJS.Timeout;

const Range = ace.acequire("ace/range").Range;

class App extends Component<{}, { fileValue: string, shortcutData: any, annotations: Array<ace.Annotation>, markers: Array<{startRow: number, endRow: number, startCol: number, endCol: number, className: string, type: string}> }> {
	reactAceComponentRef: React.RefObject<AceEditor>;
	constructor(props: Readonly<{}>) {
		super(props);
		this.state = {fileValue: "ShowResult \"Hello ScPL\"", shortcutData: testshortcut, annotations: [], markers: []};
		this.reactAceComponentRef = React.createRef<AceEditor>();
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
							ref={this.reactAceComponentRef}
						/>
					</div>
					<div className="splitItem scroll">
						<div>{this.state.shortcutData[0].WFWorkflowActions.length} actions</div>
						<ShortcutPreview debug onInteract={(data) => this.onActionSelect(data)} data={this.state.shortcutData} />
					</div>
				</div>
			</div>
		);
	}
	onActionSelect(data: {type: "action" | "parameter", actionData: any}) {
		console.log("OnActionSelect", data.actionData);
		if(data.actionData["SCPLData"]) {
			console.log("Contains SCPLData");
			const scpldata = data.actionData.SCPLData;
			
			const reactAceComponent = this.reactAceComponentRef.current;
			if(!reactAceComponent) {console.log("reactacecomponent is not yet defined"); return;}
			const editor = (reactAceComponent as any).editor as ace.Editor;
			// .Position.start|end
			const line = scpldata.Position.start[0];
			const col = scpldata.Position.start[1] - 1;
			console.log("Scrolling to line", line, col);
			editor.gotoLine(line, col, true);
			editor.selection.setRange(new Range(scpldata.Position.start[0] - 1, scpldata.Position.start[1] - 1, scpldata.Position.end[0] - 1, scpldata.Position.end[1] - 1), true);
		}
	}
	onChange(text: string) {
		if(timeout) {clearTimeout(timeout);}
		timeout = setTimeout(() => this.onChangeLimited(text), 1000);
	}
	onChangeLimited(text: string) {
		// parse
		let output: {shortcutjson: any, shortcutplist: Buffer};
		try{
			output = parse(text, { make: ["shortcutjson"] });
		}catch(er) {
			console.log(er.message);
			if(!(er instanceof PositionedError)) {throw er;}
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
