import React, { Component } from "react";
import ReactMarkdown from "react-markdown";

import { allActions, getActionFromID } from "scpl";

import { keys } from "./Key";
import { categories } from "./data/ActionCategories";

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
	canShowDetail: boolean;
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
				className={`action-item ${
					action._data.Category && categories[action._data.Category]
						? categories[action._data.Category]
						: "action-item-unknown"
				}`}
				onClick={e => {
					e.stopPropagation();
					this.props.onSelect(usage);
				}}
			>
				<div className="action-item-title">
					{action.name}
					<div className="action-item-code">{action.shortName}</div>
				</div>
				<div className="action-item-description">
					{this.props.canShowDetail ? (
						<ReactMarkdown source={action.genDocs()} />
					) : (
						(
							action._data.Description || {
								DescriptionSummary: "No description"
							}
						).DescriptionSummary
					)}
				</div>
				<div className="action-item-usage">{usage}</div>
				<a
					className="action-item-url"
					href={`https://docs.scpl.dev/actions/${encodeURIComponent(
						action.shortName
					)}`}
					target="_blank"
					rel="noreferrer"
				>
					See futher documentation
				</a>
			</div>
		);
	}
}

type SearchActionsProps = { insertText: (text: string) => void };
export class SearchActions extends Component<
	SearchActionsProps,
	{ searchTerm: string | undefined }
> {
	input: HTMLInputElement | null;
	constructor(props: Readonly<SearchActionsProps>) {
		super(props);
		this.state = { searchTerm: undefined };
		this.input = null;
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
					ref={c => (this.input = c)}
					onKeyDown={e => {
						if (keys.closePanel(e)) {
							if (this.input) {
								this.input.blur();
							}
							this.searchChanged(undefined);
						}
					}}
					onKeyUp={e => this.searchChanged(e.currentTarget.value)}
					onFocus={e => this.searchChanged(e.currentTarget.value)}
					onBlur={e =>
						setTimeout(() => this.searchChanged(undefined), 300)
					}
				/>
				{this.state.searchTerm !== undefined ? (
					<div
						className="close-search-btn"
						onClick={e => this.searchChanged(undefined)}
					>
						Cancel
					</div>
				) : null}
				<div
					className={`search-action-results ${
						this.state.searchTerm !== undefined
							? "search-action-results-visible"
							: ""
					}`}
				>
					<div
						className="close-mobile-search-btn"
						onClick={e => this.searchChanged(undefined)}
					>
						&times;
					</div>
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
						.map((action, i, v) => (
							<ActionData
								actionID={action.id}
								onSelect={text => {
									this.props.insertText(`\n${text}`);
									this.searchChanged(undefined);
								}}
								canShowDetail={v.length === 1}
								key={action.id}
							/>
						))}
				</div>
			</div>
		);
	}
}
