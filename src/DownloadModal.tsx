import React, { Component } from "react";

import { ModalContainer } from "./ModalContainer";
import { DownloadButton } from "./DownloadButton";

import prettyBytes from "pretty-bytes";

import shortcutDownloadPreviewIcon from "./img/shortcut-file.png";
import { uploadShortcut } from "./Uploader";

import "./CreateEditShortcut.css";

type DownloadModalProps = {
	onCancel: () => void;
	filename: string;
	file: Buffer | undefined;
};

export class DownloadModal extends Component<
	DownloadModalProps,
	| {
			uploadStatus: "None" | "Uploading";
	  }
	| {
			uploadStatus: "URL";
			uploadedURL: string;
	  }
	| {
			uploadStatus: "Error";
			uploadError: string;
	  }
> {
	constructor(props: Readonly<DownloadModalProps>) {
		super(props);
		this.state = { uploadStatus: "None" };
	}
	componentWillReceiveProps(nextProps: Readonly<DownloadModalProps>) {
		if (nextProps.file !== this.props.file) {
			this.setState({ uploadStatus: "None" });
		}
	}
	async uploadFile() {
		if (!this.props.file) {
			this.setState({
				uploadStatus: "Error",
				uploadError: "No file. Make sure your shortcut has no errors."
			});
			return;
		}
		this.setState({
			uploadStatus: "Uploading"
		});
		const uploadResult = await uploadShortcut(
			this.props.file,
			this.props.filename
		);
		if (uploadResult.result === "error") {
			this.setState({
				uploadStatus: "Error",
				uploadError: uploadResult.message
			});
			return;
		}
		this.setState({
			uploadStatus: "URL",
			uploadedURL: uploadResult.url
		});
	}
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
								{(() => {
									switch (this.state.uploadStatus) {
										case "None":
											return (
												<div>
													<p>
														To generate a QR code,
														ScPL editor will upload
														your shortcut to{" "}
														<a
															href="https://file.io"
															target="_blank"
															rel="noopener"
														>
															file.io
														</a>
														.
													</p>
													<button
														className="large-btn"
														onClick={() =>
															this.uploadFile()
														}
													>
														Generate Code
													</button>
													<div
													className="generate-code-load">
													<div
													className="load"></div>
													<p>Generating QR Code...</p>
													</div>
												</div>
											);
										case "URL":
											return (
												<div>
													<p>
														Add to your library via
														QR Code:
													</p>
													<div id="qr-result">
														<img
															src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
																this.state
																	.uploadedURL
															)}`}
														/>
													</div>
													<p className="details-text">
														Open your Camera app and
														point it steady for 2-3
														seconds at this QR Code.
														<br />
														<br />
														If nothing happens, QR
														Code scanning may not be
														enabled on your device.
													</p>
												</div>
											);
										case "Uploading":
											return (
												<div>
													<p>Uploading...</p>
												</div>
											);
										case "Error":
											return (
												<div>
													<p>
														Error uploading:{" "}
														{this.state.uploadError}
													</p>
												</div>
											);
										default:
											return (
												<div>
													<p>
														Something bad happened.
													</p>
												</div>
											);
									}
								})()}
							</div>
						</div>
					) : (
						<div id="no-file-msg">
							<p>
								Please write some actions to be converted into a
								shortcut.
							</p>
						</div>
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
