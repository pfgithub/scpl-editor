import React, { Component } from "react";
import Dropzone, {DropEvent} from "react-dropzone";
import { inverse } from "scpl";

import "./FilePane.css";



export class FilePane extends Component<{onActiveFileChanged: (fileContents: string) => void}> {
	onDrop(acceptedFiles: File[], _rejectedFiles: File[], _event: DropEvent) {
		const reader = new FileReader();

		reader.onabort = () => alert("file reading was aborted");
		reader.onerror = () => alert("file reading has failed");
		reader.onload = () => {
		// Do whatever you want with the file contents
			const binaryStr = new Buffer(reader.result as ArrayBuffer);
			let inverted: string;
			try{
				inverted = inverse(binaryStr);
			}catch(e) {
				alert(`An unhandled error occured while trying to convert shortcut -> scpl. The error is: ${ e.toString() }`);
				throw new Error(e);
			}
			this.props.onActiveFileChanged(inverted);
		};

		acceptedFiles.forEach(file => reader.readAsArrayBuffer(file));
	}
	render() {
		return (
			<Dropzone onDrop={this.onDrop.bind(this)}>
				{({getRootProps, getInputProps}) => (
					<div>
						<div className="files-header">
							<h2>Files</h2>
							<input type="search" className="search-input" placeholder="Search" />
							<div className="file-btns">
								<div className="large-btn file-btn upload-btn" {...getRootProps()}><input {...getInputProps()} /></div>
								<div className="large-btn file-btn new-btn"></div>
								<div className="large-btn file-btn newf-btn"></div>
							</div>
						</div>
						<div className="file-list">
							<ul>
								<li className="list-item-file"><div><div className='item-name'>Converted Shortcut.scpl</div><div className='action-btns'><div className="delete-btn"></div><div className="edit-btn"></div></div></div></li>
								<li className="list-item-folder"><div><div className='item-name'>Shortcuts Folder</div><div className='action-btns'><div className="delete-btn"></div><div className="edit-btn"></div></div></div>
									<ul>
										<li className="list-item-file"><div><div className='item-name'>Folder Item.scpl</div><div className='action-btns'><div className="delete-btn"></div><div className="edit-btn"></div></div></div></li>
										<li className="list-item-folder"><div><div className='item-name'>Shortcuts Folder</div><div className='action-btns'><div className="delete-btn"></div><div className="edit-btn"></div></div></div>
											<ul>
												<li className="list-item-file"><div><div className='item-name'>Folder Item.scpl</div><div className='action-btns'><div className="delete-btn"></div><div className="edit-btn"></div></div></div></li>
											</ul>
										</li>
									</ul>
								</li>
								<li className="list-item-folder"><div><div className='item-name'>Shortcuts Folder 2</div><div className='action-btns'><div className="delete-btn"></div><div className="edit-btn"></div></div></div>
									<ul>
										<li className="list-item-file"><div><div className='item-name'>Folder Item.scpl</div><div className='action-btns'><div className="delete-btn"></div><div className="edit-btn"></div></div></div></li>
										<li className="list-item-folder"><div><div className='item-name'>Shortcuts Folder</div><div className='action-btns'><div className="delete-btn"></div><div className="edit-btn"></div></div></div>
											<ul>
												<li className="list-item-file"><div><div className='item-name'>Folder Item.scpl</div><div className='action-btns'><div className="delete-btn"></div><div className="edit-btn"></div></div></div></li>
											</ul>
										</li>
									</ul>
								</li>
								<li className="list-item-file"><div><div className='item-name'>Something.scpl</div><div className='action-btns'><div className="delete-btn"></div><div className="edit-btn"></div></div></div></li>
								<li className="list-item-file"><div><div className='item-name'>New File.scpl</div><div className='action-btns'><div className="delete-btn"></div><div className="edit-btn"></div></div></div></li>
								<li className="list-item-folder open-folder"><div><div className='item-name'>Shortcuts Folder 3</div><div className='action-btns'><div className="delete-btn"></div><div className="edit-btn"></div></div></div>
									<ul>
										<li className="list-item-file active"><div><div className='item-name'>Folder Item.scpl</div><div className='action-btns'><div className="delete-btn"></div><div className="edit-btn"></div></div></div></li>
										<li className="list-item-folder open-folder"><div><div className='item-name'>Shortcuts Folder</div><div className='action-btns'><div className="delete-btn"></div><div className="edit-btn"></div></div></div>
											<ul>
												<li className="list-item-file"><div><div className='item-name'>Folder Item.scpl</div><div className='action-btns'><div className="delete-btn"></div><div className="edit-btn"></div></div></div></li>
												<li className="list-item-file"><div><div className='item-name'>Folder Item 2.scpl</div><div className='action-btns'><div className="delete-btn"></div><div className="edit-btn"></div></div></div></li>
												<li className="list-item-file"><div><div className='item-name'>Folder Item 3.scpl</div><div className='action-btns'><div className="delete-btn"></div><div className="edit-btn"></div></div></div></li>
												<li className="list-item-file"><div><div className='item-name'>Folder Item 4.scpl</div><div className='action-btns'><div className="delete-btn"></div><div className="edit-btn"></div></div></div></li>
											</ul>
										</li>
									</ul>
								</li>
							</ul>
						</div>
					</div>
				)}
			</Dropzone>
		);
	}
}