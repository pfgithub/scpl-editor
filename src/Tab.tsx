import React, { Component } from "react";

import { Tab } from "./App";

export class TabComponent extends Component<{
	tab: Tab;
	onClick: () => void;
	onClose: () => void;
}> {
	componentDidMount() {
		// filemanager.listenEvents(filename)
	}
	render() {
		return (
			<div>
				<button onClick={() => this.props.onClick()}>
					{this.props.tab.name ? this.props.tab.name : <i>Unnamed</i>}{" "}
					{this.props.tab.selected ? "[sel]" : ""}
				</button>
				<button onClick={() => this.props.onClose()}>x</button>
			</div>
		);
	}
}
