import React, { Component } from "react";
import { parse, PositionedError } from "scpl";
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
		loading: boolean;
		took: { waitedFor: number; convertedIn: number };
		fullUpdate: boolean;
		mobileFilemenu: boolean;
		openDownload: boolean;
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
			fullUpdate: true,
			mobileFilemenu: false,
			openDownload: false
		};
		this.reactAceComponentRef = React.createRef<AceEditor>();
	}
	componentDidMount() {}
	componentWillMount() {
		this.onChange(
			`ShowResult "Hello ScPL"
ChooseFromMenu items=["Getting Started", "View Documentation"]
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
			<div>
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
				<div className="editor-window">
					<div className="editor-navigation">
						<div
							className={`mobile-filemenu${
								this.state.mobileFilemenu
									? " open-filemenu"
									: ""
							}`}
							style={{ display: "none" }}
							onClick={() =>
								this.setState({
									fullUpdate: false,
									mobileFilemenu: !this.state.mobileFilemenu
								})
							}
						/>
						<div>
							<div className="editor-title">
								ScPL Try-It Editor
							</div>
							<div className="editor-btn">
								<a
									href="https://docs.scpl.dev/gettingstarted.html"
									target="_blank"
								>
									Getting Started
								</a>
							</div>
							<div className="editor-btn">
								<a
									href="https://docs.scpl.dev/"
									target="_blank"
								>
									Documentation
								</a>
							</div>
						</div>
						<div className="search-container">
							<SearchActions />
						</div>
						<div>
							<div className="result-details">
								<div className="result-actions">
									{
										this.state.shortcutData[0]
											.WFWorkflowActions.length
									}{" "}
									action
									{this.state.shortcutData[0]
										.WFWorkflowActions.length === 1
										? ""
										: "s"}
								</div>
							</div>
							<div
								className="editor-btn primary-btn"
								id="open-download"
								onClick={() =>
									this.setState({
										fullUpdate: false,
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
												name:
													"Look at all these files.scpl"
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
								onActiveFileChanged={file =>
									this.onChange(file)
								}
							/>
						</div>
						<div className="code-pane">
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
								this.state.loading ? " loading" : ""
							}`}
						>
							<div className="result-text">
								Converted in {this.state.took.convertedIn} ms.
							</div>
							<MaybeUpdate shouldUpdate={this.state.fullUpdate}>
								<ShortcutPreview
									onInteract={data =>
										this.onActionSelect(data)
									}
									data={this.state.shortcutData}
								/>
							</MaybeUpdate>
							<div className="loading-result-progress">
								<div>
									<div className="load" />
								</div>
							</div>
						</div>
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
				console.log("reactacecomponent is not yet defined");
				return;
			} //eslint-disable-line no-console
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
	onChange(text: string) {
		const willWaitFor = Math.max(this.state.took.convertedIn * 4, 100);
		if (!this.state.loading) {
			this.setState({
				fileValue: text,
				loading: true,
				fullUpdate: false
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
				fullUpdate: true,
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
			fullUpdate: true,
			shortcutData: shortcutjson,
			annotations: [],
			markers: [],
			shortcutDownload: shortcutplist
		});
	}
}

export default App;
