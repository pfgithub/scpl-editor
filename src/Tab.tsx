import React, { Component } from "react";

import { Tab } from "./App";

type TabComponentProps = {
	tab: Tab;
	onClick: () => void;
	onClose: () => void;
};

export class TabComponent extends Component<TabComponentProps, {}> {
	hasFile: boolean;
	constructor(props: Readonly<TabComponentProps>) {
		super(props);
		this.hasFile = false;
		this.state = {};
	}
	componentDidMount() {
		// filemanager.listenEvents(filename)
	}
	componentDidUpdate() {
		if (this.props.tab.file && !this.hasFile) {
			this.hasFile = true;
			this.props.tab.file.onChange(() => {
				console.log("Change handler called");
				this.setState({});
			});
			this.props.tab.file.onError(err => alert(err));
		}
	}
	render() {
		this.props.tab.file &&
			console.log("load status", this.props.tab.file.status.loading);
		return (
			<div>
				<button onClick={() => this.props.onClick()}>
					{this.props.tab.file ? (
						this.props.tab.file.name
					) : (
						<i>Unnamed</i>
					)}{" "}
					{this.props.tab.selected ? "[sel]" : ""}{" "}
					{this.props.tab.file
						? this.props.tab.file.status.loading > 0
							? "[load]"
							: "[ready]"
						: "[nofile]"}
				</button>
				<button onClick={() => this.props.onClose()}>x</button>
			</div>
		);
	}
}
