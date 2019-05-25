const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class FileManagerClass {
	files: { [id: string]: { cont: string; name: string } };
	fileList: { id: string; name: string; loading: boolean }[];
	onFileListChange: () => void;
	onActiveFileChanged: (id: string | undefined) => void;
	tabs: { id: string; name: string }[];
	constructor() {
		this.files = {};
		this.fileList = [];
		this.onFileListChange = () => {};
		this.onActiveFileChanged = () => {};
		this.tabs = [];
	}
	newID() {
		const uintarr = new Uint8Array(20);
		crypto.getRandomValues(uintarr);
		const id = new Buffer(uintarr).toString("hex");
		return id;
	}
	async createFile(cont: string, name: string, id: string) {
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
	addTab(id: string) {
		const existingTab = this.tabs.find(tab => tab.id === id);
		if (!existingTab) {
			this.tabs.push({ id, name: "..." });
		}
		this.tabs.forEach(tab => {
			const fileListEntry = this.fileList.find(
				file => file.id === tab.id
			);
			if (!fileListEntry) {
				tab.name = "???";
				return;
			}
			tab.name = fileListEntry.name;
		});
		this.onFileListChange();
		this.onActiveFileChanged(id);
	}
	closeTab(id: string) {
		const existingTab = this.tabs.findIndex(tab => tab.id === id);
		if (existingTab <= -1) {
			return;
		}
		const prevTab = this.tabs[existingTab - 1];
		this.onFileListChange();
		this.onActiveFileChanged(prevTab ? prevTab.id : undefined);
	}
}

export const FileManager = new FileManagerClass();
