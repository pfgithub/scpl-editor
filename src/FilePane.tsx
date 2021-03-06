import React, { Component } from "react";
import Dropzone, { DropEvent } from "react-dropzone";
import { inverse } from "scpl";

import { CreateEditShortcut } from "./CreateEditShortcut";

import "./FilePane.css";

type FileData = { type: "file"; name: string };
type FolderData = {
	type: "folder";
	name: string;
	files: (FileData | FolderData)[];
};

class ActionButtons extends Component<{}> {
	render() {
		return (
			<div className="action-btns">
				<div
					className="delete-btn"
					onClick={e => {
						e.stopPropagation();
					}}
				/>
				<div
					className="edit-btn"
					onClick={e => {
						e.stopPropagation();
					}}
				/>
			</div>
		);
	}
}

class FileComponent extends Component<{
	data: FileData;
}> {
	render() {
		return (
			<li
				className="list-item-file"
				onClick={e => {
					e.stopPropagation();
				}}
				title={this.props.data.name}
			>
				<div>
					<div className="item-name">
						<div className="load small" />
						{this.props.data.name}
					</div>
					<ActionButtons />
				</div>
			</li>
		);
	}
}

class FolderComponent extends Component<
	{
		data: FolderData;
		searchTerm: string;
	},
	{
		expanded: boolean;
	}
> {
	constructor(
		props: Readonly<{
			data: FolderData;
			searchTerm: string;
		}>
	) {
		super(props);
		this.state = { expanded: false };
	}
	render() {
		return (
			<li
				className={`list-item-folder ${
					this.state.expanded ? "open-folder" : ""
				}`}
				onClick={e => {
					this.setState({ expanded: !this.state.expanded });
					e.stopPropagation();
				}}
				title={this.props.data.name}
			>
				<div>
					<div className="item-name">{this.props.data.name}</div>
					<ActionButtons />
				</div>
				<FileList
					files={this.props.data.files}
					searchTerm={this.props.searchTerm}
				/>
			</li>
		);
	}
}

// sort:
// a.order - b.order != 0 ? a.order - b.order
// : a.name.localeCompare(b.name, undefined, {numeric: true})

class FileList extends Component<{
	files: (FileData | FolderData)[];
	searchTerm: string;
}> {
	render() {
		return (
			<ul>
				{this.props.files.map(file => {
					if (file.type === "file") {
						if (
							file.name
								.toLowerCase()
								.indexOf(this.props.searchTerm.toLowerCase()) >
							-1
						) {
							return (
								<FileComponent key={file.name} data={file} />
							);
						}
						return null;
					}
					return (
						<FolderComponent
							key={file.name}
							data={file}
							searchTerm={this.props.searchTerm}
						/>
					);
				})}
			</ul>
		);
	}
}

export class FilePane extends Component<
	{
		onActiveFileChanged: (fileContents: string) => void;
		files: (FileData | FolderData)[];
	},
	{
		showFileModal: boolean;
		searchTerm: string;
	}
> {
	constructor(
		props: Readonly<{
			onActiveFileChanged: (fileContents: string) => void;
			files: (FileData | FolderData)[];
		}>
	) {
		super(props);
		this.state = {
			showFileModal: false,
			searchTerm: ""
		};
	}
	onDrop(acceptedFiles: File[], _rejectedFiles: File[], _event: DropEvent) {
		const reader = new FileReader();

		reader.onabort = () => alert("file reading was aborted");
		reader.onerror = () => alert("file reading has failed");
		reader.onload = () => {
			// Do whatever you want with the file contents
			const binaryStr = new Buffer(reader.result as ArrayBuffer);
			let inverted: string;
			try {
				inverted = inverse(binaryStr);
			} catch (e) {
				alert(
					`An unhandled error occured while trying to convert shortcut -> scpl. The error is: ${e.toString()}`
				);
				throw new Error(e);
			}
			this.props.onActiveFileChanged(inverted);
		};

		acceptedFiles.forEach(file => reader.readAsArrayBuffer(file));
	}
	render() {
		return (
			<div>
				<Dropzone onDrop={this.onDrop.bind(this)}>
					{({ getRootProps, getInputProps }) => (
						<div>
							<div className="files-header">
								<div className="file-btns">
									<div
										className="btn file-btn large-upload-btn upload-btn"
										style={{ gridColumn: "1/4" }}
										{...getRootProps()}
									>
									Upload Shortcut
										<input {...getInputProps()} />

									</div>
								</div>
							</div>
						</div>
					)}
				</Dropzone>

				{this.state.showFileModal ? (
					<CreateEditShortcut
						onCancel={() => this.setState({ showFileModal: false })}
						onResult={(name, color, glyph) => {
							this.setState({ showFileModal: false });
						}}
					/>
				) : null}
			</div>
		);
	}
}
