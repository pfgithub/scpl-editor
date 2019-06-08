import React, { Component } from "react";
import ace from "brace";

import { EditorComponent } from "./EditorComponent";
import { TabComponent } from "./Tab";
import { FileManager, FakeConnection } from "./FileManager";

const aceCreateEditSession = (text: string) =>
	ace.createEditSession(text, ("ace/mode/scpl" as unknown) as ace.TextMode);

export type Tab =
	| {
			session: ace.IEditSession;
			selected: boolean;
			name: undefined;
			fileID: undefined;
	  }
	| {
			session: ace.IEditSession;
			selected: boolean;
			name: string;
			fileID: string;
	  };

type AppProps = {};
class App extends Component<
	AppProps,
	{
		activeTab?: Tab;
		tabs: Tab[];
		fileManager: FileManager;
	}
> {
	constructor(props: Readonly<AppProps>) {
		super(props);
		this.state = {
			activeTab: undefined,
			tabs: [],
			fileManager: new FileManager(new FakeConnection())
		};
	}
	render() {
		return (
			<div>
				{this.state.tabs.map(tab => (
					<TabComponent
						tab={tab}
						onClick={() => {
							this.state.tabs.forEach(
								tab => (tab.selected = false)
							);
							tab.selected = true;
							this.setState({
								activeTab: tab,
								tabs: this.state.tabs
							});
						}}
						onClose={() => alert("not implemented yet")}
					/>
				))}
				<button
					onClick={() => {
						this.state.tabs.push({
							session: aceCreateEditSession("my text"),
							selected: false,
							name: undefined,
							fileID: undefined
						});
						this.setState({ tabs: this.state.tabs });
					}}
				>
					+
				</button>
				{this.state.activeTab ? (
					<EditorComponent
						tab={this.state.activeTab}
						fileManager={this.state.fileManager}
						changeTabs={() =>
							this.setState({ tabs: this.state.tabs })
						}
					/>
				) : (
					<div>no file open</div>
				)}
			</div>
		);
	}
}

export default App;
