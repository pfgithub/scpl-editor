import React, { Component } from "react";

import ace from "brace";
import "./ace/mode-scpl";
import "brace/theme/chrome";
import "brace/ext/language_tools";
import "brace/ext/searchbox";
import AceEditor from "react-ace";

import { FileManager, FilenameTakenError } from "./FileManager";

import { Tab } from "./App";

const Range: ace.Range = ace.acequire("ace/range").Range;

const langTools = ace.acequire("ace/ext/language_tools");
const findAndReplace = ace.acequire("ace/ext/searchbox");

const variableCompleter = {
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
langTools.addCompleter(variableCompleter);

// The editor pane. Reads from EditorData on what to do.

type EditorComponentProps = {
	tab: Tab;
	fileManager: FileManager;
	changeTabs: () => void;
};
export class EditorComponent extends Component<EditorComponentProps, {}> {
	refEditor: React.RefObject<HTMLDivElement>;
	editor?: ace.Editor;
	constructor(props: Readonly<EditorComponentProps>) {
		super(props);
		this.refEditor = React.createRef<HTMLDivElement>();
	}
	componentDidMount() {
		this.setupAceEditor();
		this.updateAceFromProps();
	}
	componentWillUnmount() {
		this.getAce().destroy();
		this.editor = undefined;
	}
	componentDidUpdate(prev: Readonly<EditorComponentProps>) {
		this.updateAceFromProps();
	}
	setupAceEditor() {
		const component = this.refEditor.current;
		if (!component) {
			alert("!component. this should never happen.");
			throw new Error("!component");
		}
		this.editor = ace.edit(component);
		this.editor.commands.addCommand({
			name: "save",
			bindKey: { win: "Ctrl-S", mac: "Cmd-S" },
			exec: (editor: ace.Editor) => {
				if (this.props.tab.fileID) {
				} else {
					const name = prompt("Save as");
					if (!name) {
						return;
					}
					const id = this.props.fileManager.startCreateFile(name);
					if (id instanceof FilenameTakenError) {
						alert(`Filename \`${id.filename}\` already used.`);
						return;
					}
					this.props.tab.name = name;
					this.props.tab.fileID = id;
					this.props.changeTabs();
				}
				// console.log("saving", editor.session.getValue());
			}
		});
	}
	getAce(): ace.Editor {
		const editor = this.editor;
		if (!editor) {
			alert("!aceeditor. this should never happen.");
			throw new Error("!aceeditor");
		}
		return editor;
	}
	updateAceFromProps() {
		this.getAce().setSession(this.props.tab.session);
	}
	onChange(text: string) {}
	render() {
		return (
			<div style={{ display: "content" }}>
				<div className="code-pane">
					<div
						id="ace_editor"
						style={{ width: "500px", height: "500px" }}
						ref={this.refEditor}
					/>
					{
						// <AceEditor
						// 	ref={this.reactAceComponentRef}
						// 	theme="chrome"
						// 	name="ace_editor"
						// 	editorProps={{ $blockScrolling: Infinity }}
						// 	showPrintMargin={false}
						// 	enableBasicAutocompletion={true}
						// 	enableLiveAutocompletion={true}
						// />
					}
				</div>
				<div className="result-pane">
					<div className="result-text" />
				</div>
			</div>
		);
	}
}
