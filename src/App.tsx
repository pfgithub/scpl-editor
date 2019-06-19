import React, { Component } from "react";
import { parse, PositionedError } from "scpl";
import "./App.css";
import * as moment from "moment";
// import {Helmet} from "react-helmet";

import testshortcut from "./testshortcut.json";

import ace from "brace";
import "./ace/mode-scpl";
import "brace/theme/chrome";
import "brace/ext/language_tools";
import "brace/ext/searchbox";
import AceEditor from "react-ace";

import { FilePane } from "./FilePane";
import { SearchActions } from "./SearchActions";
import { DownloadModal } from "./DownloadModal";
import { keys } from "./Key";
import { UploadShortcutModal } from "./UploadShortcutModal";
import { ErrorBoundary } from "./ErrorBoundary";

import { FileManager } from "./FileManager";

import ShortcutPreview from "shortcut-preview";

let timeout: NodeJS.Timeout;
let saveTimeout: NodeJS.Timeout;

const Range = ace.acequire("ace/range").Range;

const langTools = ace.acequire("ace/ext/language_tools");
const findAndReplace = ace.acequire("ace/ext/searchbox");

const rhymeCompleter = {
	getCompletions: (
		editor: ace.Editor,
		session: ace.IEditSession,
		pos: ace.Position,
		prefix: string,
		callback: (
			thing: null,
			completions: {
				name: string;
				value: string;
				score: number;
				meta: string;
			}[]
		) => void
	) => {
		if (prefix.length === 0) {
			callback(null, []);
			return;
		}
		const variables = session.getValue().match(/(v|mv):([A-Za-z0-9]+)/g);
		console.log(variables);
		if (!variables) {
			callback(null, []);
			return;
		}
		callback(
			null,
			variables.map(v => ({
				name: v,
				value: v,
				score: 25,
				meta: v
			}))
		);
	}
};
langTools.addCompleter(rhymeCompleter);

const hotkey =
	window.navigator.platform === "MacIntel" ||
	window.navigator.platform.includes("Win")
		? "⌘"
		: "^";

class MaybeUpdate extends Component<{ shouldUpdate: boolean }, {}> {
	shouldComponentUpdate(nextProps: { shouldUpdate: boolean }) {
		return nextProps.shouldUpdate;
	}
	render() {
		return this.props.children;
	}
}

const now = () => new Date().getTime();

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
		showUploadShortcutModal: boolean;
		tabs: { id: string; name: string }[];
		files: {
			[filename: string]: string;
		};
		filesNew: { id: string; name: string; loading: boolean }[];
		activeID: string | undefined;
		lastSave: number;
		lastChage: number;
		saveStatus: "saved" | "unsaved" | "saving";
		loginstatus: "unknown" | "notloggedin" | "loggingin" | "loggedin";
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
			showUploadShortcutModal: false,
			errors: [],
			tabs: [],
			activeID: undefined,
			filesNew: [],
			lastSave: 0,
			lastChage: 0,
			saveStatus: "saved",
			loginstatus: "unknown",
			files: {
				"download.scpl": `ShowResult "Hello ScPL"
	ChooseFromMenu "ScPL Editor" items=["Getting Started", "View Documentation"]
	Case "Getting Started"
	    URL "https://docs.scpl.dev/gettingstarted"
	Case "View Documentation"
	    URL "https://docs.scpl.dev/"
	End Menu
	OpenURLs`,
				"other.scpl": `ShowResult "ScPL"`,
				urlquery:
					new URLSearchParams(window.location.search).get("scpl") ||
					""
			}
		};
		this.reactAceComponentRef = React.createRef<AceEditor>();
	}
	componentDidMount() {}
	componentWillMount() {
		const urlParams = new URLSearchParams(window.location.search);
		this.onChange(
			new URLSearchParams(window.location.search).get("scpl") ||
				`ShowResult "Hello ScPL"
ChooseFromMenu "ScPL Editor" items=["Getting Started", "View Documentation"]
Case "Getting Started"
    URL "https://docs.scpl.dev/gettingstarted"
Case "View Documentation"
    URL "https://docs.scpl.dev/"
End Menu
OpenURLs`
		);
		FileManager.onFileListChange = () => {
			this.setState({
				filesNew: FileManager.fileList,
				tabs: FileManager.tabs
			});
		};
		FileManager.onActiveFileChanged = async (id: string | undefined) => {
			if (this.state.activeID) {
				FileManager.saveFile(this.state.activeID, this.state.fileValue);
			}
			if (!id) {
				return this.setState({ activeID: undefined });
			}
			// get the file
			this.setState({ activeID: undefined });
			const file = await FileManager.loadFile(id);
			// check last save time
			this.setState({ activeID: id, lastSave: now() });
			this.onChange(file);
		};
		this.login();
		document.body.onfocus = () => {
			this.login();
		};
	}
	async login() {
		const logintoken = localStorage.getItem("logintoken");
		this.setState({ loginstatus: "loggingin" });
		// request to server
		const result = true;
		if (result) {
			this.setState({ loginstatus: "loggedin" });
		}
		// else setstate(loginerr)
		this.setState({ loginstatus: "notloggedin" });
	}
	render() {
		return (
			<div
				onKeyDown={e => {
					if (keys.save(e)) {
						alert("save");
					}
					if (keys.export(e)) {
						this.setState({ openDownload: true });
					}
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
				{this.state.showUploadShortcutModal ? (
					<UploadShortcutModal
						onCancel={() =>
							this.setState({ showUploadShortcutModal: false })
						}
						onResult={result => {
							this.setState({ showUploadShortcutModal: false });
							this.onChange(result);
						}}
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
												New File
												<span>{hotkey}N</span>
											</a>
										</li>
										<li style={{ display: "none" }}>
											<a href="javascript:;">
												New Folder
												<span>&#8679;{hotkey}N</span>
											</a>
										</li>
										<li>
											<a href="javascript:;">
												Save File
												<span>{hotkey}S</span>
											</a>
										</li>
										<li>
											<a href="javascript:;">
												Close Tab
												<span>{hotkey}E</span>
											</a>
										</li>
										<div className="menu-div" />
										<li>
											<a
												href="javascript:;"
												onClick={() =>
													this.setState({
														showUploadShortcutModal: true
													})
												}
											>
												Import Shortcut from iCloud
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
												<span>&#8679;{hotkey}S</span>
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
												Undo<span>{hotkey}Z</span>
											</a>
										</li>
										<li>
											<a
												href="javascript:;"
												onClick={() =>
													this.getAce().redo()
												}
											>
												Redo
												<span>&#8679;{hotkey}Z</span>
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
												Cut<span>{hotkey}X</span>
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
												Copy<span>{hotkey}C</span>
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
												Paste<span>{hotkey}P</span>
											</a>
										</li>
										<div className="menu-div" />
										<li>
											<a
												href="javascript:;"
												onClick={() =>
													this.getAce().selectAll()
												}
											>
												Select All
												<span>{hotkey}A</span>
											</a>
										</li>
										<li>
											<a href="javascript:;">
												Format Code
												<span>&#8679;{hotkey}B</span>
											</a>
										</li>
										<li>
											<a
												href="javascript:;"
												onClick={() =>
													findAndReplace.Search(
														this.getAce()
													)
												}
											>
												Find and Replace
												<span>{hotkey}F</span>
											</a>
										</li>
									</ul>
								</li>
							</ul>
						</div>
						<div className="editor-menu">
							<ul>
								<li>
									Account
									<ul>
										<li><a href="https://account.scpl.dev/settings" target="_blank">Account Settings</a></li>
										<li><a href="https://account.scpl.dev/filebrowser" target="_blank">Manage Files</a></li>
										<li><a href="https://account.scpl.dev/shared" target="_blank">Shared with you</a></li>
										<div className="menu-div" />
										<li><a href="https://account.scpl.dev/login" target="_blank">Login</a></li>
										<li><a href="https://account.scpl.dev/sign-up" target="_blank">Create Account</a></li>
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
												href="https://scpl.dev/"
												target="_blank"
											>
												About
											</a>
										</li>
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
										<li>
											<a
												href="https://github.com/pfgithub/scpl-editor"
												target="_blank"
											>
												Editor GitHub
											</a>
										</li>
										<li>
											<a
												href="https://discordapp.com/invite/2qqfFKc"
												target="_blank"
											>
												ScPL Discord
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
						<div className="savedstatus">
							{this.state.saveStatus === "saved" ? (
								"All changes saved"
							) : this.state.saveStatus === "saving" ? (
								"Saving..."
							) : (
								<a
									className="last-saved"
									onClick={async () => {
										clearTimeout(saveTimeout);
										this.state.activeID &&
											(await FileManager.saveFile(
												this.state.activeID,
												this.state.fileValue
											));
										this.setState({
											saveStatus: "saved",
											lastSave: now()
										});
									}}
								>
									Last saved:{" "}
									{moment
										.unix(this.state.lastSave / 1000)
										.fromNow()}
								</a>
							)}
						</div>
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
							<a href="javascript:;">Export</a>
						</div>
					</div>
				</div>
				<div className="editor-container">
					<div
						className={`file-pane${
							this.state.mobileFilemenu ? " open-menu" : ""
						}`}
					>
						<div
							className="no-files-overlay"
							style={{ display: "none" }}
						>
							<div>
								<h3>No files&mdash;yet.</h3>
								<p>
									Add files above by creating ScPL files
									<br />
									or by uploading or importing a shortcut.
								</p>
							</div>
						</div>
						{/*<div className="no-account-btns">
						<button className="btn large-upload-btn stretch-btn">
							Upload Shortcut
						</button>
						<button className="btn large-import-btn stretch-btn">
							Import Shortcut
						</button>
					</div>
					<div className="no-account-overlay">
						<div>
						<p>
							Sign up or login to save<br/>and manage your ScPL files.
							<br/><br/>
							<a
							href="https://account.scpl.dev/sign-up"
							className="editor-btn primary-btn btn"
							target="_blank"
							rel="noopener"
							>
								Sign up
							</a>
							<a
							href="https://account.scpl.dev/login"
							className="editor-btn btn trans-btn"
							target="_blank"
							rel="noopener"
							>
								Login
							</a>
						</p>
						</div>
						<div className="no-account-overlay">
							<div>
								<p>
									Sign up or login to save
									<br />
									and manage your ScPL files.
									<br />
									<br />
									<a
										href="https://account.scpl.dev/sign-up"
										className="editor-btn primary-btn btn"
									>
										Sign up
									</a>
									<a
										href="https://account.scpl.dev/login"
										className="editor-btn btn trans-btn"
									>
										Login
									</a>
								</p>
							</div>
						</div>*/}
						<FilePane
							files={this.state.filesNew}
							onActiveFileChanged={file => this.onChange(file)}
						/>
						<a
							href="https://account.scpl.dev/settings"
							target="_blank"
							rel="noopener"
						>
							<div className="account-settings-bar">
								Account Settings
							</div>
						</a>
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
						<div className="tabs-nav">
							{this.state.tabs.length > 1 ? (
								<div className="file-tabs">
									{this.state.tabs.map(tab => (
										<div
											className={`tab ${
												this.state.activeID === tab.id
													? "active-tab"
													: ""
											}`}
											onClick={e => {
												e.stopPropagation();
												FileManager.addTab(tab.id);
											}}
										>
											<div className="tab-close">
												&times;
											</div>
											<div className="tab-label">
												{tab.name}
											</div>
										</div>
									))}
								</div>
							) : null}
							<div className="variables-container">
								<div className="variables">
									<div className="global-variables">
										<div className="variable">
											Ask When Run
										</div>
										<div className="variable clipboard-v">
											<div>Clipboard</div>
										</div>
										<div className="variable date-v">
											<div>Current Date</div>
										</div>
										<div className="variable input-v">
											<div>Extension Input</div>
										</div>
									</div>
									<div className="code-variables">
										<div className="variable">example</div>
										<div className="variable mv">
											<div>magic</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						{this.state.activeID ? (
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
								enableBasicAutocompletion={true}
								enableLiveAutocompletion={true}
							/>
						) : (
							<div className="editor-error no-open-files">
								<div>
									<h3>No files are open in the editor.</h3>
									<p>
										Upload or import a shortcut, plus create
										and
										<br />
										manage ScPL files in the left pane.
									</p>
								</div>
							</div>
						)}
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
							Converted in <span id="highlight-result">{this.state.took.convertedIn} ms.</span>
						</div>
						{this.state.showPreview &&
						this.state.errors.length === 0 ? (
							<ErrorBoundary
								errorDisplay={err => (
									<div className="preview-error render-error shortcut-preview-fatal-error">
										<div className="render-text">
										<p>
											A fatal error occured in
											shortcut-preview. The error is{" "}
											{err.toString()}
										</p>
										</div>
									</div>
								)}
							>
								<ShortcutPreview
									onInteract={data =>
										this.onActionSelect(data)
									}
									data={this.state.shortcutData}
								/>
							</ErrorBoundary>
						) : null}
						<div className="loading-result-progress">
							<div>
								<div className="spinner">
									<div className="bar1" />
									<div className="bar2" />
									<div className="bar3" />
									<div className="bar4" />
									<div className="bar5" />
									<div className="bar6" />
									<div className="bar7" />
									<div className="bar8" />
									<div className="bar9" />
									<div className="bar10" />
									<div className="bar11" />
									<div className="bar12" />
								</div>
							</div>
						</div>
						{!this.state.showPreview ? (
							<div className="preview-error render-error">
								<div>
									<p>
										There are too many actions to render a
										preview automatically.
									</p>
									<button
										className="btn trans-btn"
										onClick={() =>
											this.setState({
												showPreview: true
											})
										}
									>
										Render Preview
									</button>
								</div>
							</div>
						) : null}
						{this.state.errors.length !== 0 ? (
							<div className="preview-error render-error">
								<div>
									<p>
										Failed to render because of code error.
									</p>
								</div>
							</div>
						) : null}
					</div>
				</div>
			</div>
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
		this.setState({ lastChage: now() });
		const willWaitFor = text.length < 500 ? 100 : 1000;
		this.setState({
			fileValue: text,
			loading: true,
			saveStatus: "unsaved"
		});
		if (!this.state.loading) {
			this.setState({ showPreview: text.length < 500 });
		}
		if (saveTimeout) {
			clearTimeout(saveTimeout);
		}
		saveTimeout = setTimeout(async () => {
			this.setState({ saveStatus: "saving" });
			this.state.activeID &&
				(await FileManager.saveFile(this.state.activeID, text));
			this.setState({ saveStatus: "saved", lastSave: now() });
		}, 1000);
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
