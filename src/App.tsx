import React, { Component } from "react";
import { parse, PositionedError } from "scpl";
import {
	HotKeys as Hotkeys,
	configure as configureHotkeys
} from "react-hotkeys";
configureHotkeys({ simulateMissingKeyPressEvents: true });
import "./App.css";
// import {Helmet} from "react-helmet";

import testshortcut from "./testshortcut.json";

import ace from "brace";
import "./ace/mode-scpl";
import "brace/theme/chrome";
import AceEditor from "react-ace";

import { FilePane } from "./FilePane";
import { SearchActions } from "./SearchActions";
import { DownloadModal } from "./DownloadModal";

import ShortcutPreview from "shortcut-preview";

let timeout: NodeJS.Timeout;

const Range = ace.acequire("ace/range").Range;

class MaybeUpdate extends Component<{ shouldUpdate: boolean }, {}> {
	shouldComponentUpdate(nextProps: { shouldUpdate: boolean }) {
		return nextProps.shouldUpdate;
	}
	render() {
		return this.props.children;
	}
}

class App extends Component<
	{},
	{
		fileValue: string;
		shortcutData: any;
		shortcutDownload: Buffer | undefined;
		annotations: Array<ace.Annotation>;
		markers: Array<{
			startRow: number;
			endRow: number;
			startCol: number;
			endCol: number;
			className: string;
			type: string;
		}>;
		errors: Array<{
			startRow: number;
			endRow: number;
			startCol: number;
			endCol: number;
			message: string;
		}>;
		loading: boolean;
		took: { waitedFor: number; convertedIn: number };
		mobileFilemenu: boolean;
		openDownload: boolean;
		showPreview: boolean;
		showPreviewFullscreen: boolean;
		tabs: { filename: string; active: boolean }[];
		files: {
			[filename: string]: string;
		};
	}
> {
	reactAceComponentRef: React.RefObject<AceEditor>;
	constructor(props: Readonly<{}>) {
		super(props);
		this.state = {
			fileValue: "...",
			shortcutData: testshortcut,
			shortcutDownload: undefined,
			annotations: [],
			markers: [],
			loading: false,
			took: { waitedFor: 0, convertedIn: 0 },
			mobileFilemenu: false,
			openDownload: false,
			showPreview: false,
			showPreviewFullscreen: false,
			errors: [],
			tabs: [
				{ filename: "download.scpl", active: true },
				{ filename: "other.scpl", active: false }
			],
			files: {
				"download.scpl": `ShowResult "Hello ScPL"
	ChooseFromMenu "ScPL Editor" items=["Getting Started", "View Documentation"]
	Case "Getting Started"
	    URL "https://docs.scpl.dev/gettingstarted"
	Case "View Documentation"
	    URL "https://docs.scpl.dev/"
	End Menu
	OpenURLs`,
				"other.scpl": `ShowResult "ScPL"`
			}
		};
		this.reactAceComponentRef = React.createRef<AceEditor>();
	}
	componentDidMount() {}
	componentWillMount() {
		this.onChange(
			`ShowResult "Hello ScPL"
ChooseFromMenu "ScPL Editor" items=["Getting Started", "View Documentation"]
Case "Getting Started"
    URL "https://docs.scpl.dev/gettingstarted"
Case "View Documentation"
    URL "https://docs.scpl.dev/"
End Menu
OpenURLs`
		);
	}
	render() {
		return (
			<Hotkeys
				keyMap={{
					save: ["command+s", "ctrl+s"],
					export: ["command+shift+s", "ctrl+shift+s"],
					undo: ["command+z", "ctrl+z", "ctrl+i"],
					redo: [
						"command+shift+z",
						"ctrl+shift+z",
						"command+y",
						"ctrl+y"
					],
					closePanel: "escape"
				}}
				handlers={{
					undo: () => this.getAce().undo(),
					redo: () => this.getAce().redo(),
					export: () => this.setState({ openDownload: true })
				}}
			>
				<div className="upload-area" style={{ display: "none" }}>
					<div>Drop file anywhere to upload</div>
				</div>
				{this.state.openDownload ? (
					<DownloadModal
						onCancel={() => {
							this.setState({ openDownload: false });
						}}
						filename={
							this.state.shortcutData._filename ||
							"download.shortcut"
						}
						file={this.state.shortcutDownload}
					/>
				) : null}

				<div className="editor-navigation">
					<div
						className={`mobile-filemenu${
							this.state.mobileFilemenu ? " open-filemenu" : ""
						}`}
						style={{ display: "none" }}
						onClick={() =>
							this.setState({
								mobileFilemenu: !this.state.mobileFilemenu
							})
						}
					/>
					<div>
						<div className="editor-title">ScPL Editor</div>
						<div className="editor-menu">
							<ul>
								<li>
									File
									<ul>
										<li>
											<a href="javascript:;">
												New File<span>&#8984;N</span>
											</a>
										</li>
										<li>
											<a href="javascript:;">
												New Folder
												<span>&#8679;&#8984;N</span>
											</a>
										</li>
										<li>
											<a href="javascript:;">
												Save File<span>&#8984;S</span>
											</a>
										</li>
										<li>
											<a href="javascript:;">
												Close Tab<span>&#8984;E</span>
											</a>
										</li>
										<div className="menu-div" />
										<li>
											<a href="javascript:;">
												Upload Shortcut
											</a>
										</li>
										<li>
											<a
												href="javascript:;"
												onClick={() =>
													this.setState({
														openDownload: true
													})
												}
											>
												Export Shortcut
												<span>&#8679;&#8984;S</span>
											</a>
										</li>
									</ul>
								</li>
							</ul>
						</div>
						<div className="editor-menu">
							<ul>
								<li>
									Edit
									<ul>
										<li>
											<a
												href="javascript:;"
												onClick={() =>
													this.getAce().undo()
												}
											>
												Undo<span>&#8984;Z</span>
											</a>
										</li>
										<li>
											<a
												href="javascript:;"
												onClick={() =>
													this.getAce().redo()
												}
											>
												Redo<span>&#8679;&#8984;Z</span>
											</a>
										</li>
										<div className="menu-div" />
										<li>
											<a
												href="javascript:;"
												onClick={() =>
													document.execCommand(
														"cut"
													) ||
													alert(
														"Please press ctrl/cmd+x to cut"
													)
												}
											>
												Cut<span>&#8984;X</span>
											</a>
										</li>
										<li>
											<a
												href="javascript:;"
												onClick={() =>
													document.execCommand(
														"copy"
													) &&
													alert(
														"Please press ctrl/cmd+c to copy"
													)
												}
											>
												Copy<span>&#8984;C</span>
											</a>
										</li>
										<li>
											<a
												href="javascript:;"
												onClick={() =>
													document.execCommand(
														"paste"
													) ||
													alert(
														"Please press ctrl/cmd+v to paste."
													)
												}
											>
												Paste<span>&#8984;P</span>
											</a>
										</li>
										<li>
											<a
												href="javascript:;"
												onClick={() =>
													this.getAce().selectAll()
												}
											>
												Select All<span>&#8984;A</span>
											</a>
										</li>
									</ul>
								</li>
							</ul>
						</div>
						<div className="editor-menu">
							<ul>
								<li>
									Help
									<ul>
										<li>
											<a
												href="https://docs.scpl.dev/gettingstarted.html"
												target="_blank"
											>
												Getting Started
											</a>
										</li>
										<li>
											<a
												href="https://docs.scpl.dev/"
												target="_blank"
											>
												Documentation
											</a>
										</li>
									</ul>
								</li>
							</ul>
						</div>
					</div>
					<div className="search-container">
						<SearchActions
							insertText={text => {
								console.log("insert", text);
								const reactAceComponent = this
									.reactAceComponentRef.current;
								const editor = (reactAceComponent as any)
									.editor as ace.Editor;
								editor.session.insert(
									editor.getCursorPosition(),
									text
								);
								console.log(
									editor.session.getValue(),
									text,
									editor.getCursorPosition()
								);
								this.setState({
									fileValue: editor.session.getValue()
								});
							}}
						/>
					</div>
					<div>
						<div className="result-details">
							<div className="result-actions">
								{
									this.state.shortcutData[0].WFWorkflowActions
										.length
								}{" "}
								action
								{this.state.shortcutData[0].WFWorkflowActions
									.length === 1
									? ""
									: "s"}
							</div>
						</div>

						<div className="editor-btn" id="run-preview">
							<a
								href="javascript:;"
								onClick={() => {
									this.setState({
										showPreviewFullscreen: !this.state
											.showPreviewFullscreen,
										showPreview: !this.state
											.showPreviewFullscreen
									});
								}}
							>
								Preview
							</a>
						</div>
						<div
							className="editor-btn primary-btn"
							id="open-download"
							onClick={() =>
								this.setState({
									openDownload: true
								})
							}
						>
							<a href="javascript:;">Download</a>
						</div>
					</div>
				</div>
				<div className="editor-container">
					<div
						className={`file-pane${
							this.state.mobileFilemenu ? " open-menu" : ""
						}`}
					>
						<FilePane
							files={[
								{
									type: "file" as "file",
									name: "My File.scpl"
								},
								{
									type: "file" as "file",
									name: "Another File.scpl"
								},
								{
									type: "folder" as "folder",
									name: "A Folder",
									files: [
										{
											type: "file" as "file",
											name: "My File.scpl"
										},
										{
											type: "folder" as "folder",
											name: "My Folder",
											files: [
												{
													type: "file" as "file",
													name: "A Shortcut.scpl"
												}
											]
										},
										{
											type: "file" as "file",
											name: "Look at all these files.scpl"
										}
									]
								},
								{
									type: "file" as "file",
									name: "My File 2.scpl"
								},
								{
									type: "file" as "file",
									name: "Another File 2.scpl"
								}
							]}
							onActiveFileChanged={file => this.onChange(file)}
						/>
					</div>
					<div className="code-pane">
						<div className="error-messages">
							{this.state.errors.map(err => (
								<div className="e-message">
									<div className="message-content">
										{err.message}
									</div>
									<div className="jump-error">
										<button
											onClick={() =>
												this.jumpToError(err)
											}
										>
											Jump
										</button>
									</div>
								</div>
							))}
						</div>
						{this.state.tabs.length > 1 ? (
							<div className="file-tabs">
								{this.state.tabs.map(tab => (
									<div
										className={`tab ${
											tab.active ? "active-tab" : ""
										}`}
									>
										<div className="tab-close">&times;</div>
										<div className="tab-label">
											{tab.filename}
										</div>
									</div>
								))}
							</div>
						) : null}
						<AceEditor
							mode="scpl"
							theme="chrome"
							onChange={this.onChange.bind(this)}
							name="ace_editor"
							editorProps={{ $blockScrolling: Infinity }}
							value={this.state.fileValue || ""}
							annotations={this.state.annotations}
							markers={this.state.markers}
							ref={this.reactAceComponentRef}
							showPrintMargin={false}
						/>
					</div>
					<div
						className={`result-pane${
							this.state.loading && this.state.showPreview
								? " loading"
								: ""
						}${
							!this.state.showPreviewFullscreen
								? " mobiledisabled"
								: ""
						}`}
						// style={{
						// 	display: this.state.showPreview ? "none" : "block"
						// }}
					>
						<div className="result-text">
							Converted in {this.state.took.convertedIn} ms.
						</div>
						{this.state.showPreview ? (
							<ShortcutPreview
								onInteract={data => this.onActionSelect(data)}
								data={this.state.shortcutData}
							/>
						) : null}
						<div className="loading-result-progress">
							<div>
								<div className="load" />
							</div>
						</div>
						{!this.state.showPreview ? (
							<div className="too-many-actions">
								<div>
									<p>
										There are too many actions to render a
										preview automatically.
									</p>
									<button
										className="btn trans-btn"
										onClick={() =>
											this.setState({ showPreview: true })
										}
									>
										Render Preview
									</button>
								</div>
							</div>
						) : null}
					</div>
				</div>
			</Hotkeys>
		);
	}
	onActionSelect(data: { type: "action" | "parameter"; actionData: any }) {
		if (data.actionData.SCPLData) {
			const scpldata = data.actionData.SCPLData;

			const reactAceComponent = this.reactAceComponentRef.current;
			if (!reactAceComponent) {
				return;
			}
			const editor = (reactAceComponent as any).editor as ace.Editor;
			// .Position.start|end
			const line = scpldata.Position.start[0];
			const col = scpldata.Position.start[1] - 1;
			editor.gotoLine(line, col, true);
			editor.selection.setRange(
				new Range(
					scpldata.Position.start[0] - 1,
					scpldata.Position.start[1] - 1,
					scpldata.Position.end[0] - 1,
					scpldata.Position.end[1] - 1
				),
				true
			);
		}
	}
	getAce(): ace.Editor {
		const reactAceComponent = this.reactAceComponentRef.current;
		if (!reactAceComponent) {
			throw new Error("No reactacecomponent");
		}
		const editor = (reactAceComponent as any).editor as ace.Editor;
		return editor;
	}
	jumpToError(d: {
		startCol: number;
		startRow: number;
		endCol: number;
		endRow: number;
	}) {
		const reactAceComponent = this.reactAceComponentRef.current;
		if (!reactAceComponent) {
			return;
		}
		const editor = (reactAceComponent as any).editor as ace.Editor;
		const line = d.startRow;
		const col = d.startCol - 1;
		editor.gotoLine(line, col, true);
		editor.selection.setRange(
			new Range(
				d.startRow - 1,
				d.startCol - 1,
				d.endRow - 1,
				d.endCol - 1
			),
			true
		);
	}
	onChange(text: string) {
		const willWaitFor = Math.max(this.state.took.convertedIn * 4, 100);
		if (!this.state.loading) {
			this.setState({
				showPreview: this.state.took.convertedIn < 50,
				fileValue: text,
				loading: true
			});
		}
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(
			() => this.onChangeLimited(text, willWaitFor),
			willWaitFor
		);
	}
	onChangeLimited(text: string, waitedFor: number) {
		// parse
		let output: { shortcutjson: any; shortcutplist: Buffer };
		const startTime = new Date().getTime();
		try {
			output = parse(text, { make: ["shortcutjson", "shortcutplist"] });
		} catch (er) {
			console.log(er.message); //eslint-disable-line no-console
			if (!(er instanceof PositionedError)) {
				throw er;
			}
			this.setState({
				fileValue: text,
				loading: false,
				shortcutDownload: undefined,
				took: {
					waitedFor: waitedFor,
					convertedIn: new Date().getTime() - startTime
				},
				annotations: [
					{
						row: er.start[0] - 1,
						column: er.start[1] - 1,
						text: er.message, // Or the Json reply from the parser
						type: "error" // also warning and information
					}
				],
				markers: [
					{
						startRow: er.start[0] - 1,
						endRow: er.end[0] - 1,
						startCol: er.start[1] - 1,
						endCol: er.end[1] - 1,
						className: "ace_active-line error",
						type: "background"
					}
				],
				errors: [
					{
						startRow: er.start[0],
						endRow: er.end[0],
						startCol: er.start[1],
						endCol: er.end[1],
						message: er.message
					}
				]
			});
			return;
		}
		const { shortcutjson, shortcutplist } = output;
		this.setState({
			fileValue: text,
			took: {
				waitedFor: waitedFor,
				convertedIn: new Date().getTime() - startTime
			},
			loading: false,
			shortcutData: shortcutjson,
			annotations: [],
			markers: [],
			errors: [],
			shortcutDownload: shortcutplist
		});
	}
}

export default App;
