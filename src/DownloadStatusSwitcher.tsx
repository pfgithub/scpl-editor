import React, { Component } from "react";

export type UploadStatus =
	| {
			uploadStatus: "None" | "Uploading";
	  }
	| {
			uploadStatus: "URL";
			uploadedURL: string;
			qrcode: string;
	  }
	| {
			uploadStatus: "Error";
			uploadError: string;
	  };

export class DownloadStatusSwitcher extends Component<{
	status: UploadStatus;
	requestUpload: () => void;
	detailsMsg: React.ReactNode;
	uploadAction: string;
	additionalButtonClasses?: string;
}> {
	render() {
		switch (this.props.status.uploadStatus) {
			case "None":
				return (
					<div>
					<br/><br/>
						<button
							className={`btn ${this.props
								.additionalButtonClasses || ""}`}
							onClick={() => this.props.requestUpload()}
						>
							{this.props.uploadAction}
						</button>
						<p className="details-text">{this.props.detailsMsg}</p>
					</div>
				);
			case "URL":
				return this.props.children;
			case "Uploading":
				return (
					<div>
						<div className="generate-code-load">
							<div className="load" />
							<p>Uploading...</p>
						</div>
					</div>
				);
			case "Error":
				return (
					<div>
						<p>Error uploading: {this.props.status.uploadError}</p>
					</div>
				);
			default:
				return (
					<div>
						<p>Something bad happened.</p>
					</div>
				);
		}
	}
}
