import React, { Component } from "react";
import {parse, PositionedError} from "scpl";
import logo from "./logo.svg"; //
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

class DownloadButton extends Component<{filename: string, file: Buffer | undefined}, {}> { // from https://github.com/axetroy/react-download
	render() {
		return <a href="#" className="editor-btn primary-btn" onClick={(e) => this.onClick(e)}>Download (.shortcut)</a>;
	}
	fakeClick(obj: HTMLAnchorElement) {
		const ev = document.createEvent("MouseEvents");
		ev.initMouseEvent(
			"click",
			true,
			false,
			window,
			0,
			0,
			0,
			0,
			0,
			false,
			false,
			false,
			false,
			0,
			null
		);
		obj.dispatchEvent(ev);
	}
	exportRaw(name: string, data: Buffer) {
		const urlObject = window.URL || (window as any).webkitURL || window;
		const export_blob = new Blob([data]);

		if ("msSaveBlob" in navigator) {
			// Prefer msSaveBlob if available - Edge supports a[download] but
			// ignores the filename provided, using the blob UUID instead.
			// msSaveBlob will respect the provided filename
			navigator.msSaveBlob(export_blob, name);
		} else if ("download" in HTMLAnchorElement.prototype) {
			const save_link = document.createElementNS(
				"http://www.w3.org/1999/xhtml",
				"a"
			) as HTMLAnchorElement;
			save_link.href = urlObject.createObjectURL(export_blob);
			save_link.download = name;
			this.fakeClick(save_link);
		} else {
			alert("Downloading shortcuts is not available on this browser yet :(\nIt should be implemented within a few days.");
		}
	}
	onClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
		if(!this.props.file) {return;}
		this.exportRaw(this.props.filename, this.props.file);
	}
}

class App extends Component<{}, { fileValue: string, shortcutData: any, shortcutDownload: Buffer | undefined, annotations: Array<ace.Annotation>, markers: Array<{startRow: number, endRow: number, startCol: number, endCol: number, className: string, type: string}>, loading: boolean, took: number, fullUpdate: boolean }> {
	reactAceComponentRef: React.RefObject<AceEditor>;
	constructor(props: Readonly<{}>) {
		super(props);
		this.state = {fileValue: "ShowResult \"Hello ScPL\"", shortcutData: testshortcut, shortcutDownload: undefined, annotations: [], markers: [], loading: false, took: 0, fullUpdate: true};
		this.reactAceComponentRef = React.createRef<AceEditor>();
	}
	render() {
		return (
			<div className="editor-window">
				<div className="editor-navigation">
					<div>
						<div className="editor-title">ScPL Try-It Editor</div>
						<a className="editor-btn" href="https://docs.scpl.dev/gettingstarted" target="_blank">Getting Started</a>
						<a className="editor-btn" href="https://docs.scpl.dev" target="_blank">Documentation</a>
					</div>
					<div>
						<div className="result-details">
							<div className="result-actions">{this.state.shortcutData[0].WFWorkflowActions.length} action{this.state.shortcutData[0].WFWorkflowActions.length === 1 ? "" : "s"}</div>
						</div>
						<DownloadButton filename={this.state.shortcutData._filename || "download.shortcut"} file={this.state.shortcutDownload} />
						<div className="download-or"> or </div>
						<a href="#" className="editor-btn" onClick={() => alert("Downloading through QR codes is not implemented yet :(\nIt should be implemented within a few days.")}>Download via QR Code</a>
					</div>
				</div>
				<div className="editor-container">
					<div className="code-pane">
  
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
					<div className={`result-pane${this.state.loading ? " loading" : ""}`}>
						<div className="result-text">{this.state.shortcutData[0].WFWorkflowActions.length} action{this.state.shortcutData[0].WFWorkflowActions.length === 1 ? "" : "s"} in {this.state.took} ms.</div>
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
			output = parse(text, { make: ["shortcutjson", "shortcutplist"] });
		}catch(er) {
			console.log(er.message);
			if(!(er instanceof PositionedError)) {throw er;}
			this.setState({
				fileValue: text,
				loading: false,
				shortcutDownload: undefined,
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
			loading: false, fullUpdate: true, shortcutData: shortcutjson, annotations: [], markers: [],
			shortcutDownload: shortcutplist
		});	
	}
}

export default App;
