import React, { Component } from "react";

import "./SearchActions.css";

export class SearchActions extends Component<{}> {
	render() {
		return (
			<div>
				<input className="search-input" placeholder="Search Actions"/>
				<div className="search-action-results">
					<div className="action-item action-item-get-clipboard">
						<div className="action-item-title">Get Clipboard<div className="action-item-code">getclipboard</div></div>
						<div className="action-item-description">Passes the contents of the clipboard to the next action.</div>
						<div className="action-item-usage">getclipboard</div>
					</div>

					<div className="action-item action-item-count">
						<div className="action-item-title">Count<div className="action-item-code">count</div></div>
						<div className="action-item-description">Counts the number of items, characters, words, sentences, or lines passed as input.</div>
						<div className="action-item-usage">count count=("Items" | "Characters" | "Words" | "Sentences" | "Lines")</div>
					</div>
				</div>
			</div>
		);
	}
}
