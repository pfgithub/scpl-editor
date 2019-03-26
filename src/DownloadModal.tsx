import React, { Component } from "react";

import { ModalContainer } from "./ModalContainer";
import { DownloadButton } from "./DownloadButton";

import shortcutDownloadPreviewIcon from "./img/shortcut-file.png";

import "./CreateEditShortcut.css";

export class DownloadModal extends Component<
	{
		onCancel: () => void;
		filename: string;
		file: Buffer | undefined;
	},
	{}
> {
	render() {
		return (
			<ModalContainer onCancel={() => this.props.onCancel()}>
				<div
					className="modal"
					id="download-result"
					style={{
						display: "block"
					}}
					onClick={e => e.stopPropagation()}
				>
					<h1>Download Export</h1>
					{this.props.file ? (
						<div className="download-grid">
							<div>
								<DownloadButton
									filename={this.props.filename}
									file={this.props.file}
								>
									<img
										src={shortcutDownloadPreviewIcon}
										width={130}
									/>
									<div className="shortcut-filename">
										download.shortcut
									</div>
									<div className="shortcut-filedetails">
										5 KB
									</div>
								</DownloadButton>
							</div>
							<div>
								<p>Add to your library via QR Code:</p>
								<div id="qr-result">Not available yet :(</div>
								<p className="details-text">
									Open your Camera app and point it steady for
									2-3 seconds at this QR Code.
									<br />
									<br />
									If nothing happens, QR Code scanning may not
									be enabled on your device.
								</p>
							</div>
						</div>
					) : (
						<h2>No file. Try editing the shortcut.</h2>
					)}
					<div
						className="large-btn"
						id="close-download"
						onClick={() => this.props.onCancel()}
					>
						Done
					</div>
				</div>
			</ModalContainer>
		);
	}
}