import React, { Component } from "react";
import { Portal } from "react-portal";
import { HotKeys as Hotkeys, ObserveKeys } from "react-hotkeys";

export class ModalContainer extends Component<{ onCancel: () => void }> {
	render() {
		return (
			<Portal>
				<Hotkeys handlers={{ closePanel: () => this.props.onCancel() }}>
					<ObserveKeys only={["closePanel"]} except={[]}>
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
					</ObserveKeys>
				</Hotkeys>
			</Portal>
		);
	}
}
