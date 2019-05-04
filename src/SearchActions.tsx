import React, { Component } from "react";
import ReactMarkdown from "react-markdown";

import { allActions, getActionFromID } from "scpl";

import "./SearchActions.css";

const actionsByName = allActions.sort((a, b) => {
	if (a.name > b.name) {
		return 1;
	}
	if (a.name < b.name) {
		return -1;
	}
	return 0;
});

class ActionData extends Component<{
	onSelect: (text: string) => void;
	actionID: string;
}> {
	render() {
		const action = getActionFromID(this.props.actionID);
		if (!action) {
			return null;
		}
		const usage = action
			.genDocsUsage()
			.replace(/^```\s+(.+?)\s+```$/, "$1");
		return (
			<div
				className="action-item action-item-get-clipboard"
				onClick={e => {
					e.stopPropagation();
					this.props.onSelect(usage);
				}}
			>
				<div className="action-item-title">
					{action.name}
					<div className="action-item-code">{action.shortName}</div>
				</div>
				<a
					className="action-item-url"
					href={`https://docs.scpl.dev/actions/${encodeURIComponent(
						action.shortName
					)}`}
					target="_blank"
					rel="noreferrer"
				>
					Documentation
				</a>
				<div className="action-item-description">
					{/*<ReactMarkdown source={action.genDocs()} />*/}
					{
						(
							action._data.Description || {
								DescriptionSummary: "No description"
							}
						).DescriptionSummary
					}
				</div>
				<div className="action-item-usage">{usage}</div>
			</div>
		);
	}
}

type SearchActionsProps = { insertText: (text: string) => void };
export class SearchActions extends Component<
	SearchActionsProps,
	{ searchTerm: string | undefined }
> {
	constructor(props: Readonly<SearchActionsProps>) {
		super(props);
		this.state = { searchTerm: undefined };
	}
	searchChanged(value: string | undefined) {
		const searchTerm = value;
		this.setState({ searchTerm: searchTerm });
	}
	render() {
		return (
			<div onMouseUp={e => e.stopPropagation()}>
				<input
					className="search-input"
					placeholder="Search Actions"
					onKeyUp={e => this.searchChanged(e.currentTarget.value)}
					onFocus={e => this.searchChanged(e.currentTarget.value)}
					onBlur={e =>
						setTimeout(() => this.searchChanged(undefined), 1000)
					}
				/>
				<div
					className={`search-action-results ${
						this.state.searchTerm !== undefined
							? "search-action-results-visible"
							: ""
					}`}
				>
					{actionsByName
						.filter(
							action =>
								action.name
									.toLowerCase()
									.replace(/[^A-Za-z0-9]/g, "")
									.indexOf(
										(
											this.state.searchTerm || "kjhgvb"
										).replace(/[^A-Za-z0-9]/g, "")
									) > -1
						)
						.map(action => (
							<ActionData
								actionID={action.id}
								onSelect={text => {
									this.props.insertText(text);
									this.searchChanged(undefined);
								}}
							/>
						))}
				</div>
			</div>
		);
	}
}
