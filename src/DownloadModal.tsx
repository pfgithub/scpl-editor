import React, { Component } from "react";

import * as QRCode from "qrcode";

import { ModalContainer } from "./ModalContainer";
import { DownloadButton } from "./DownloadButton";

import prettyBytes from "pretty-bytes";

import shortcutDownloadPreviewIcon from "./img/shortcut-file.png";
import { uploadShortcut } from "./Uploader";
import { DownloadStatusSwitcher, UploadStatus } from "./DownloadStatusSwitcher";

import "./CreateEditShortcut.css";

export class ShortcutDownloadPreviewButton extends Component<
	{ filename: string; filesize: number },
	{}
> {
	render() {
		return (
			<div>
				<img src={shortcutDownloadPreviewIcon} width={130} />
				<div className="shortcut-filename">{this.props.filename}</div>
				<div className="shortcut-filedetails">
					{prettyBytes(this.props.filesize)}
				</div>
			</div>
		);
	}
}

type DownloadModalProps = {
	onCancel: () => void;
	filename: string;
	file: Buffer | undefined;
};

export class DownloadModal extends Component<DownloadModalProps, UploadStatus> {
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
		const qrcode = await QRCode.toDataURL(uploadResult.url);
		this.setState({
			uploadStatus: "URL",
			uploadedURL: uploadResult.url,
			qrcode: qrcode
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
					<h2>Export Shortcut File</h2>
					{this.props.file ? (
						<div className="download-grid">
							<div>
								{"download" in HTMLAnchorElement.prototype ? (
									<DownloadButton
										filename={this.props.filename}
										file={this.props.file}
									>
										<ShortcutDownloadPreviewButton
											filename={this.props.filename}
											filesize={Buffer.byteLength(
												this.props.file
											)}
										/>
									</DownloadButton>
								) : (
									<DownloadStatusSwitcher
										status={this.state}
										requestUpload={() => this.uploadFile()}
										detailsMsg={
											<div>
												To download on this browser,
												ScPL editor will upload your
												shortcut to{" "}
												<a
													href="https://file.io"
													target="_blank"
													rel="noopener"
												>
													file.io
												</a>
												.
											</div>
										}
										uploadAction="Create Download Link"
									>
										<a
											target="_blank"
											rel="noopener noreferrer"
											href={
												(this.state as any).uploadedURL
											}
										>
											<ShortcutDownloadPreviewButton
												filename={this.props.filename}
												filesize={Buffer.byteLength(
													this.props.file
												)}
											/>
										</a>
									</DownloadStatusSwitcher>
								)}
							</div>
							<div className="download-or">or</div>
							<div>
								<DownloadStatusSwitcher
									status={this.state}
									requestUpload={() => this.uploadFile()}
									detailsMsg={
										<div>
											To generate a QR code, ScPL editor
											will upload your shortcut to{" "}
											<a
												href="https://file.io"
												target="_blank"
												rel="noopener"
											>
												file.io
											</a>
											.
										</div>
									}
									uploadAction="Generate QR Code"
									additionalButtonClasses="qr-btn"
								>
									<div>
										<p style={{ display: "none" }}>
											Add to your library via QR Code:
										</p>
										<div id="qr-result">
											<div
												className="qrresimg"
												style={{
													backgroundImage: `url(${
														(this.state as any)
															.qrcode
													})`
												}}
											/>
										</div>
										<p className="details-text">
											Open your Camera app and point it
											steady for 2-3 seconds at this QR
											Code.
										</p>
									</div>
								</DownloadStatusSwitcher>
							</div>
						</div>
					) : (
						<div id="no-file-msg">
							<p>Your code seems to have some errors.</p>
						</div>
					)}
					<br />
					<div
						className="btn large-btn"
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
