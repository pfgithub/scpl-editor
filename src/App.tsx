import React, { Component } from "react";
import {parse} from "scpl";
import logo from "./logo.svg";
import "./App.css";

import brace from "brace";
import AceEditor from "react-ace";

class App extends Component {
	render() {
		return (
			<div className="App">
				<AceEditor
					mode="javascript"
					theme="github"
					onChange={this.onChange.bind(this)}
					name="ace_editor"
					editorProps={{$blockScrolling: true}}
				/>
			</div>
		);
	}
	onChange() {
		
	}
}

export default App;
