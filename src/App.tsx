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

class MaybeUpdate extends Component<{shouldUpdate: boolean}, {}> {
	shouldComponentUpdate(nextProps: {shouldUpdate: boolean}) {
		return nextProps.shouldUpdate;
	}
	render() {
		return this.props.children;
	}
}

class App extends Component<{}, { fileValue: string, shortcutData: any, annotations: Array<ace.Annotation>, markers: Array<{startRow: number, endRow: number, startCol: number, endCol: number, className: string, type: string}>, loading: boolean, took: number, fullUpdate: boolean }> {
	reactAceComponentRef: React.RefObject<AceEditor>;
	constructor(props: Readonly<{}>) {
		super(props);
		this.state = {fileValue: "ShowResult \"Hello ScPL\"", shortcutData: testshortcut, annotations: [], markers: [], loading: false, took: 0, fullUpdate: true};
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
					<div className={`splitItem scroll${this.state.loading ? " loading" : ""}`}>
						<div>{this.state.shortcutData[0].WFWorkflowActions.length} action{this.state.shortcutData[0].WFWorkflowActions.length === 1 ? "" : "s"} in {this.state.took} ms.</div>
						<MaybeUpdate shouldUpdate={this.state.fullUpdate}><ShortcutPreview onInteract={(data) => this.onActionSelect(data)} data={this.state.shortcutData} /></MaybeUpdate>
					</div>
				</div>
			</div>
		);
	}
	onActionSelect(data: {type: "action" | "parameter", actionData: any}) {
		if(data.actionData.SCPLData) {
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
		if(!this.state.loading) {this.setState({fileValue: text, loading: true, fullUpdate: false});}
		if(timeout) {clearTimeout(timeout);}
		timeout = setTimeout(() => this.onChangeLimited(text), Math.max(this.state.took * 4, 100));
	}
	onChangeLimited(text: string) {
		// parse
		let output: {shortcutjson: any, shortcutplist: Buffer};
		const startTime = (new Date()).getTime();
		try{
			output = parse(text, { make: ["shortcutjson"] });
		}catch(er) {
			console.log(er.message);
			if(!(er instanceof PositionedError)) {throw er;}
			this.setState({
				fileValue: text,
				loading: false,
				took: (new Date()).getTime() - startTime,
				fullUpdate: true,
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
		this.setState({
			fileValue: text,
			took: (new Date()).getTime() - startTime,
			loading: false, fullUpdate: true, shortcutData: shortcutjson, annotations: [], markers: []
		});	
	}
}

export default App;
