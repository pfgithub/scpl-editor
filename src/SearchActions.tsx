import React, { Component } from "react";

import "./SearchActions.css";

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
			<div>
				<input
					className="search-input"
					placeholder="Search Actions"
					onKeyUp={e => this.searchChanged(e.currentTarget.value)}
					onFocus={e => this.searchChanged(e.currentTarget.value)}
				/>
				<div
					className={`search-action-results ${
						this.state.searchTerm !== undefined
							? "search-action-results-visible"
							: ""
					}`}
				>
					<div
						className="action-item action-item-get-clipboard"
						onClick={() => {
							this.props.insertText("getclipboard");
							this.searchChanged(undefined);
						}}
					>
						<div className="action-item-title">
							Get Clipboard
							<div className="action-item-code">getclipboard</div>
						</div>
						<div className="action-item-description">
							Passes the contents of the clipboard to the next
							action.
						</div>
						<div className="action-item-usage">getclipboard</div>
					</div>
				</div>
			</div>
		);
	}
}
