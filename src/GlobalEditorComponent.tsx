import React, { Component } from "react";

import ace from "brace";
import "./ace/mode-scpl";
import "brace/theme/chrome";
import "brace/ext/language_tools";
import "brace/ext/searchbox";
import AceEditor from "react-ace";

import { GlobalEditorData } from "./GlobalEditorData";

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

// The editor pane. Reads from GlobalEditorData on what to do.

type GlobalEditorComponentProps = {};
export class GlobalEditorComponent extends Component<
	GlobalEditorComponentProps,
	{}
> {
	reactAceComponentRef: React.RefObject<AceEditor>;
	constructor(props: Readonly<GlobalEditorComponentProps>) {
		super(props);
		this.reactAceComponentRef = React.createRef<AceEditor>();
	}
	componentDidMount() {
		GlobalEditorData.doSetText = newText => this.getAce().setValue(newText);
		GlobalEditorData.doInsertText = newText =>
			this.getAce().insert(newText);
	}
	getAce(): ace.Editor {
		const reactAceComponent = this.reactAceComponentRef.current;
		if (!reactAceComponent) {
			throw new Error("No reactacecomponent");
		}
		const editor = (reactAceComponent as any).editor as ace.Editor;
		return editor;
	}
	render() {
		return (
			<div style={{ display: "content" }}>
				<div className="code-pane">
					<div id="ace-mount-component" />
					<AceEditor
						ref={this.reactAceComponentRef}
						onChange={text =>
							GlobalEditorData.onTextChanged &&
							GlobalEditorData.onTextChanged(text)
						}
					/>
				</div>
				<div className="result-pane">
					<div className="result-text" />
				</div>
			</div>
		);
	}
}
