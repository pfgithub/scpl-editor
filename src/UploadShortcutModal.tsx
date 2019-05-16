import React, { Component } from "react";
import { inverse } from "scpl";

import { ModalContainer } from "./ModalContainer";

import { DownloadStatusSwitcher, UploadStatus } from "./DownloadStatusSwitcher";
import { downloadShortcut } from "./Uploader";

import "./UploadShortcutModal.css";

type UploadShortcutProps = {
	onCancel: () => void;
	onResult: (filecont: string) => void;
};

export class UploadShortcutModal extends Component<
	UploadShortcutProps,
	{ uploadStatus: UploadStatus; shortcutID: string }
> {
	constructor(props: Readonly<UploadShortcutProps>) {
		super(props);
		this.state = {
			uploadStatus: { uploadStatus: "None" },
			shortcutID: ""
		};
	}
	async convertShortcut(data: ArrayBuffer) {
		const binaryStr = new Buffer(data);
		let inverted: string;
		try {
			inverted = inverse(binaryStr);
		} catch (e) {
			this.setState({
				uploadStatus: {
					uploadStatus: "Error",
					uploadError: `An unhandled error occured while trying to convert shortcut -> scpl. The error is: ${e.toString()}`
				}
			});
			throw new Error(e);
		}
		this.props.onResult(inverted);
	}
	async downloadShortcut() {
		if (!this.state.shortcutID) {
			this.setState({
				uploadStatus: {
					uploadStatus: "Error",
					uploadError: "No ID."
				}
			});
			return;
		}
		this.setState({
			uploadStatus: { uploadStatus: "Uploading" }
		});
		const uploadResult = await downloadShortcut(this.state.shortcutID);
		if (uploadResult.result === "error") {
			this.setState({
				uploadStatus: {
					uploadStatus: "Error",
					uploadError: uploadResult.message
				}
			});
			return;
		}
		// done
		await this.convertShortcut(uploadResult.shortcut);
	}
	render() {
		return (
			<ModalContainer onCancel={() => this.props.onCancel()}>
				<div
					className="modal dialog"
					id="create-edit-shortcut"
					style={{ display: "block" }}
				>
				<div
				className="cancel-btn"
				id="close-import"
				onClick={() => this.props.onCancel()}
				>
					Cancel
				</div>
					<h2>Import Shortcut</h2>
					<input
						type="text"
						placeholder="https://www.icloud.com/shortcuts/"
						onKeyUp={e => {
							const shortcutID = e.currentTarget.value.match(
								/[a-z0-9]{32}/
							);
							if (!shortcutID) {
								this.setState({ shortcutID: "" });
								return;
							}
							this.setState({ shortcutID: shortcutID[0] });
						}}
					/>
					<p className="details-text">{this.state.shortcutID}</p>
					<DownloadStatusSwitcher
						status={this.state.uploadStatus}
						requestUpload={() => this.downloadShortcut()}
						detailsMsg={
							<div>
								To convert your shortcut from iCloud, ScPL Editor will upload your shortcut
								to{" "}
								<a
									href="https://shortcutsweb.app"
									target="_blank"
									rel="noopener"
								>
									shortcutsweb.app
								</a>
								.
							</div>
						}
						uploadAction="Convert Shortcut to ScPL"
					/>

				</div>
			</ModalContainer>
		);
	}
}
