import React, { Component } from "react";
import {parse, inverse, PositionedError} from "scpl";
import "./App.css";
import Dropzone, {DropEvent} from "react-dropzone";
// import {Helmet} from "react-helmet";

import shortcutDownloadPreviewIcon from "./img/shortcut-file.png";

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
		return <a href="javascript:;" id="download-shortcut-link" onClick={(e) => this.onClick(e)}>{this.props.children}</a>;
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
			alert("Downloading shortcuts is not available on this browser yet :(\nIt should be implemented within a few days from a few days from a while from now.");
		}
	}
	onClick(_e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
		if(!this.props.file) {return;}
		this.exportRaw(this.props.filename, this.props.file);
	}
}

class App extends Component<{}, { fileValue: string, shortcutData: any, shortcutDownload: Buffer | undefined, annotations: Array<ace.Annotation>, markers: Array<{startRow: number, endRow: number, startCol: number, endCol: number, className: string, type: string}>, loading: boolean, took: {waitedFor:number, convertedIn:number}, fullUpdate: boolean, mobileFilemenu: boolean, openDownload: boolean }> {
	reactAceComponentRef: React.RefObject<AceEditor>;
	constructor(props: Readonly<{}>) {
		super(props);
		this.state = {fileValue: "ShowResult \"Hello ScPL\"", shortcutData: testshortcut, shortcutDownload: undefined, annotations: [], markers: [], loading: false, took: {waitedFor: 0, convertedIn: 0}, fullUpdate: true, mobileFilemenu: false, openDownload: false};
		this.reactAceComponentRef = React.createRef<AceEditor>();
	}
	render() {
		return (
			<Dropzone onDrop={this.onDrop.bind(this)}>
				{({getRootProps, getInputProps}) => (
					<div>
						<div className="upload-area" style={{display: "none"}}><div>Drop file anywhere to upload</div></div>
						<div className="modals-container" style={{display: this.state.openDownload ? "flex" : "none"}} onClick={() => this.setState({fullUpdate: false, openDownload: false})}>
							<div className="modal" id="download-result" style={{display: this.state.openDownload ? "block" : "none"}} onClick={e => e.stopPropagation()}>
								<h1>Download Export</h1>
								<div className="download-grid">
									<div>
										<DownloadButton filename={this.state.shortcutData._filename || "download.shortcut"} file={this.state.shortcutDownload}>
											<img src={shortcutDownloadPreviewIcon} width={130} />
											<div className="shortcut-filename">download.shortcut</div>
											<div className="shortcut-filedetails">5 KB</div>
										</DownloadButton>
									</div>
									<div>
										<p>Add to your library via QR Code:</p>
										<div id="qr-result">Not available yet :(</div>
										<p className="details-text">Open your Camera app and point it steady for 2-3 seconds at this QR Code.<br /><br />If nothing happens, QR Code scanning may not be enabled on your device.</p>
									</div>
								</div>
								<div className="large-btn" id="close-download" onClick={() => this.setState({fullUpdate: false, openDownload: false})}>Done</div>
							</div>
						</div>
						<div className="modal" id="search-actions" />
						<div className="editor-window">
							<div className="editor-navigation">
								<div className={`mobile-filemenu${this.state.mobileFilemenu ? " open-filemenu" : ""}`} style={{display: "none"}} onClick={() => this.setState({fullUpdate: false, mobileFilemenu: !this.state.mobileFilemenu})} />
								<div>
									<div className="editor-title">ScPL Try-It Editor</div>
									<div className="editor-btn"><a href="https://docs.scpl.dev/gettingstarted.html" target="_blank">Getting Started</a></div>
									<div className="editor-btn"><a href="https://docs.scpl.dev/" target="_blank">Documentation</a></div>
								</div>
								<div>
									<div className="result-details">
										<div className="result-actions">{this.state.shortcutData[0].WFWorkflowActions.length} action{this.state.shortcutData[0].WFWorkflowActions.length === 1 ? "" : "s"}</div>
									</div>
									<div className="editor-btn primary-btn" id="open-download" onClick={() => this.setState({fullUpdate: false, openDownload: true})}><a href="javascript:;">Download</a></div>
								</div>
							</div>
							<div className="editor-container">
								<div className={`file-pane${this.state.mobileFilemenu ? " open-menu" : ""}`}>
									<h2>Files</h2>
									<input type="search" className="search-input" placeholder="Search" />

									<div className="large-btn upload-btn" {...getRootProps()}><input {...getInputProps()} />Upload Shortcut</div>
									<div className="file-list">
										<ul>
											<li><div className="name-container">Files are not done yet</div></li>
										</ul>
									</div>
								</div>
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
										showPrintMargin={false}
									/>
								</div>
								<div className={`result-pane${this.state.loading ? " loading" : ""}`}>
									<div className="result-text">Waited for {this.state.took.waitedFor}ms and then converted in {this.state.took.convertedIn} ms.</div>
									<MaybeUpdate shouldUpdate={this.state.fullUpdate}><ShortcutPreview onInteract={(data) => this.onActionSelect(data)} data={this.state.shortcutData} /></MaybeUpdate>
									<div className="loading-result-progress"><div className="load"></div></div>
								</div>
							</div>
						</div>
					</div>
				)}
			</Dropzone>
		);
	}
	onDrop(acceptedFiles: File[], _rejectedFiles: File[], _event: DropEvent) {
		const reader = new FileReader();

		reader.onabort = () => alert("file reading was aborted");
		reader.onerror = () => alert("file reading has failed");
		reader.onload = () => {
			// Do whatever you want with the file contents
			const binaryStr = new Buffer(reader.result as ArrayBuffer);
			this.onChange(inverse(binaryStr));
		};

		acceptedFiles.forEach(file => reader.readAsArrayBuffer(file));
	}
	onActionSelect(data: {type: "action" | "parameter", actionData: any}) {
		if(data.actionData.SCPLData) {
			const scpldata = data.actionData.SCPLData;

			const reactAceComponent = this.reactAceComponentRef.current;
			if(!reactAceComponent) {console.log("reactacecomponent is not yet defined"); return;} //eslint-disable-line no-console
			const editor = (reactAceComponent as any).editor as ace.Editor;
			// .Position.start|end
			const line = scpldata.Position.start[0];
			const col = scpldata.Position.start[1] - 1;
			editor.gotoLine(line, col, true);
			editor.selection.setRange(new Range(scpldata.Position.start[0] - 1, scpldata.Position.start[1] - 1, scpldata.Position.end[0] - 1, scpldata.Position.end[1] - 1), true);
		}
	}
	onChange(text: string) {
		const willWaitFor = Math.max(this.state.took.convertedIn * 4, 100);
		if(!this.state.loading) {this.setState({fileValue: text, loading: true, fullUpdate: false});}
		if(timeout) {clearTimeout(timeout);}
		timeout = setTimeout(() => this.onChangeLimited(text, willWaitFor), willWaitFor);
	}
	onChangeLimited(text: string, waitedFor: number) {
		// parse
		let output: {shortcutjson: any, shortcutplist: Buffer};
		const startTime = (new Date()).getTime();
		try{
			output = parse(text, { make: ["shortcutjson", "shortcutplist"] });
		}catch(er) {
			console.log(er.message); //eslint-disable-line no-console
			if(!(er instanceof PositionedError)) {throw er;}
			this.setState({
				fileValue: text,
				loading: false,
				shortcutDownload: undefined,
				took: {waitedFor: waitedFor, convertedIn: (new Date()).getTime() - startTime},
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
			took: {waitedFor: waitedFor, convertedIn: (new Date()).getTime() - startTime},
			loading: false, fullUpdate: true, shortcutData: shortcutjson, annotations: [], markers: [],
			shortcutDownload: shortcutplist
		});
	}
}

export default App;
