import React, { Component } from "react";

export class DownloadButton extends Component<
	{ filename: string; file: Buffer | undefined },
	{}
> {
	// from https://github.com/axetroy/react-download
	render() {
		return (
			<a
				href="javascript:;"
				id="download-shortcut-link"
				onClick={e => this.onClick(e)}
			>
				{this.props.children}
			</a>
		);
	}
	fakeClick(obj: HTMLAnchorElement) {
		const ev = document.createEvent("MouseEvents");
		ev.initMouseEvent(
			"click",
			true,
			false,
			window,
			0,
			0,
			0,
			0,
			0,
			false,
			false,
			false,
			false,
			0,
			null
		);
		obj.dispatchEvent(ev);
	}
	exportRaw(name: string, data: Buffer) {
		const urlObject = window.URL || (window as any).webkitURL || window;
		const export_blob = new Blob([data]);

		if ("msSaveBlob" in navigator) {
			// Prefer msSaveBlob if available - Edge supports a[download] but
			// ignores the filename provided, using the blob UUID instead.
			// msSaveBlob will respect the provided filename
			navigator.msSaveBlob(export_blob, name);
		} else if ("download" in HTMLAnchorElement.prototype) {
			const save_link = document.createElementNS(
				"http://www.w3.org/1999/xhtml",
				"a"
			) as HTMLAnchorElement;
			save_link.href = urlObject.createObjectURL(export_blob);
			save_link.download = name;
			this.fakeClick(save_link);
		} else {
			alert(
				"Downloading shortcuts is not available on this browser yet :(\nIt should be implemented within a few days from a few days from a while from now."
			);
		}
	}
	onClick(_e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
		if (!this.props.file) {
			return;
		}
		this.exportRaw(this.props.filename, this.props.file);
	}
}
