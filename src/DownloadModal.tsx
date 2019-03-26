import React, { Component } from "react";

import { ModalContainer } from "./ModalContainer";
import { DownloadButton } from "./DownloadButton";

import prettyBytes from "pretty-bytes";

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
					<h1>Download Shortcut Export</h1>
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
										{this.props.filename}
									</div>
									<div className="shortcut-filedetails">
										{prettyBytes(
											Buffer.byteLength(this.props.file)
										)}
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
						<div id="no-file-msg"><p>You need to write actions to be converted into a shortcut.</p></div>
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
