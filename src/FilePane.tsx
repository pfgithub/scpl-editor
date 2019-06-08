import React, { Component } from "react";
import Dropzone, { DropEvent } from "react-dropzone";
import { inverse } from "scpl";

import { FileManager } from "./FileManager";

import { CreateEditShortcut } from "./CreateEditShortcut";

import "./FilePane.css";

type FileData = { type: "file"; name: string };
type FolderData = {
	type: "folder";
	name: string;
	files: (FileData | FolderData)[];
};

class ActionButtons extends Component<{
	data: { id: string; name: string; loading: boolean };
}> {
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
						const newName = prompt(
							"Filename",
							this.props.data.name
						);
						if (!newName) {
							return;
						}
						// FileManager.renameFile(this.props.data.id, newName);
					}}
				/>
			</div>
		);
	}
}

class FileComponent extends Component<{
	data: { id: string; name: string; loading: boolean };
}> {
	render() {
		return (
			<li
				className={`list-item-file ${
					this.props.data.loading ? "loading" : ""
				}`}
				onClick={e => {
					e.stopPropagation();
					// FileManager.loadFile(this.props.data.id);
					// FileManager.addTab(this.props.data.id);
				}}
				title={this.props.data.name}
			>
				<div>
					<div className="item-name">
						<div className="spinner">
							<div className="bar1" />
							<div className="bar2" />
							<div className="bar3" />
							<div className="bar4" />
							<div className="bar5" />
							<div className="bar6" />
							<div className="bar7" />
							<div className="bar8" />
							<div className="bar9" />
							<div className="bar10" />
							<div className="bar11" />
							<div className="bar12" />
						</div>
						{this.props.data.name}
					</div>
					<ActionButtons data={this.props.data} />
				</div>
			</li>
		);
	}
}

// class FolderComponent extends Component<
// 	{
// 		data: FolderData;
// 		searchTerm: string;
// 	},
// 	{
// 		expanded: boolean;
// 	}
// > {
// 	constructor(
// 		props: Readonly<{
// 			data: FolderData;
// 			searchTerm: string;
// 		}>
// 	) {
// 		super(props);
// 		this.state = { expanded: false };
// 	}
// 	render() {
// 		return (
// 			<li
// 				className={`list-item-folder ${
// 					this.state.expanded ? "open-folder" : ""
// 				}`}
// 				onClick={e => {
// 					this.setState({ expanded: !this.state.expanded });
// 					e.stopPropagation();
// 				}}
// 				title={this.props.data.name}
// 			>
// 				<div>
// 					<div className="item-name">
// 						<div className="spinner">
// 							<div className="bar1" />
// 							<div className="bar2" />
// 							<div className="bar3" />
// 							<div className="bar4" />
// 							<div className="bar5" />
// 							<div className="bar6" />
// 							<div className="bar7" />
// 							<div className="bar8" />
// 							<div className="bar9" />
// 							<div className="bar10" />
// 							<div className="bar11" />
// 							<div className="bar12" />
// 						</div>
// 						{this.props.data.name}
// 					</div>
// 					<ActionButtons />
// 				</div>
// 				<FileList
// 					files={this.props.data.files}
// 					searchTerm={this.props.searchTerm}
// 				/>
// 			</li>
// 		);
// 	}
// }

// sort:
// a.order - b.order != 0 ? a.order - b.order
// : a.name.localeCompare(b.name, undefined, {numeric: true})

class FileList extends Component<{
	files: { id: string; name: string; loading: boolean }[];
	searchTerm: string;
}> {
	render() {
		return (
			<ul>
				{this.props.files.map(file => {
					// if (file.type === "file") {
					if (
						file.name
							.toLowerCase()
							.indexOf(this.props.searchTerm.toLowerCase()) > -1
					) {
						return <FileComponent key={file.name} data={file} />;
					}
					return null;
					// }
					// return (
					// 	<FolderComponent
					// 		key={file.name}
					// 		data={file}
					// 		searchTerm={this.props.searchTerm}
					// 	/>
					// );
				})}
			</ul>
		);
	}
}

export class FilePane extends Component<
	{
		onActiveFileChanged: (fileContents: string) => void;
		files: { id: string; name: string; loading: boolean }[];
	},
	{
		showFileModal: boolean;
		searchTerm: string;
	}
> {
	constructor(
		props: Readonly<{
			onActiveFileChanged: (fileContents: string) => void;
			files: { id: string; name: string; loading: boolean }[];
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
								<input
									type="search"
									className="search-input"
									placeholder="Search Files"
									onKeyUp={e =>
										this.setState({
											searchTerm: e.currentTarget.value
										})
									}
								/>
								<div className="file-btns">
									<div
										className="btn file-btn upload-btn"
										{...getRootProps()}
									>
										<input {...getInputProps()} />
									</div>
									<button className="btn file-btn import-btn" />
									<button
										className="btn file-btn new-btn"
										onClick={() =>
											this.setState({
												showFileModal: true
											})
										}
									/>
									<button className="btn file-btn newf-btn" />
								</div>
							</div>
							<div className="file-list">
								<FileList
									files={this.props.files}
									searchTerm={this.state.searchTerm}
								/>
							</div>
						</div>
					)}
				</Dropzone>

				{this.state.showFileModal ? (
					<CreateEditShortcut
						onCancel={() => this.setState({ showFileModal: false })}
						onResult={(name, color, glyph) => {
							this.setState({ showFileModal: false });
							// const id = FileManager.newID();
							// FileManager.createFile(
							// 	`@Color ${color}\n@Icon ${glyph}`,
							// 	name,
							// 	id
							// );
							// FileManager.addTab(id);
						}}
					/>
				) : null}
			</div>
		);
	}
}
