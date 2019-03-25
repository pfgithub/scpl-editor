import React, { Component } from "react";
import { Portal } from "react-portal";

export class ModalContainer extends Component<{ onCancel: () => void }> {
	render() {
		return (
			<Portal>
				<div
					className="modals-container"
					style={{
						display: "flex"
					}}
					onClick={() => this.props.onCancel()}
				>
					<div onClick={e => e.stopPropagation()}>
						{this.props.children}
					</div>
				</div>
			</Portal>
		);
	}
}
