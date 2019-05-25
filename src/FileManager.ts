const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class FileManagerClass {
	files: { [id: string]: { cont: string; name: string } };
	fileList: { id: string; name: string; loading: boolean }[];
	onFileListChange: () => void;
	constructor() {
		this.files = {};
		this.fileList = [];
		this.onFileListChange = () => {};
	}
	async createFile(cont: string, name: string) {
		//
		const uintarr = new Uint8Array(20);
		crypto.getRandomValues(uintarr);
		const id = new Buffer(uintarr).toString("hex");

		this.files[id] = { cont, name };
		const fileListEntry = { id, name, loading: true };
		this.fileList.push(fileListEntry);

		this.onFileListChange();

		// tell server about the file
		await delay(1000);

		fileListEntry.loading = false;
		this.onFileListChange();
	}
	async renameFile(id: string, name: string) {
		const fileListEntry = this.fileList.find(file => file.id === id);
		if (!fileListEntry) {
			throw new Error(`File with id ${id} has no list entry.`);
		}
		fileListEntry.name = name;
		fileListEntry.loading = true;

		const fileValueEntry = this.files[id];
		if (fileValueEntry) {
			fileValueEntry.name = name;
		}

		this.onFileListChange();

		// tell server about file rename
		await delay(1000);

		fileListEntry.loading = false;
		this.onFileListChange();
	}
	async saveFile(id: string, newCont: string) {
		const fileListEntry = this.fileList.find(file => file.id === id);
		if (!fileListEntry) {
			throw new Error(`File with id ${id} has no list entry.`);
		}
		fileListEntry.name = name;
		fileListEntry.loading = true;

		const fileValueEntry = this.files[id];
		if (fileValueEntry) {
			fileValueEntry.cont = newCont;
		}

		this.onFileListChange();

		// tell server about file save
		await delay(1000);

		fileListEntry.loading = false;
		this.onFileListChange();
	}
	async loadFile(id: string): Promise<string> {
		if (this.files[id]) {
			return this.files[id].cont;
		}

		await delay(1000);

		throw new Error(`File with id ${id} does not exist.`);
	}
}

export const FileManager = new FileManagerClass();
