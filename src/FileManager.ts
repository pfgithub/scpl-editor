const ms = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class FilenameTakenError extends Error {
	filename: string;
	constructor(filename: string) {
		super(`Filename already in use: \`${filename}\``);
		this.name = "FilenameTakenError";
		this.filename = filename;
	}
}

export type TaskCompletion = {};

let i = 0;

type ConnectionResultError = { error: true; message: string };

export interface Connection {
	saveFile(
		id: string,
		cont: string
	): Promise<ConnectionResultError | { error: false }>;
	renameFile(
		id: string,
		newName: string
	): Promise<ConnectionResultError | { error: false }>;
	createFile(
		name: string,
		initialCont?: string
	): Promise<ConnectionResultError | { error: false; id: string }>;
}
export class TestConnection implements Connection {
	async saveFile(
		id: string,
		cont: string
	): Promise<ConnectionResultError | { error: false }> {
		console.log("-- Started Saving File --", { id, cont });
		await ms(100);
		console.log("-- Completed Save! --", { id, cont });
		if (Math.random() > 0.9) {
			console.log(" |> Save was a failure :(");
			return {
				error: true,
				message:
					"Failed to save file because random number was greater than 0.9"
			};
		}
		console.log(" |> Save was success!");
		return { error: false };
	}
	async renameFile(
		id: string,
		newName: string
	): Promise<ConnectionResultError | { error: false }> {
		console.log("-- Started Renaming File --", { id, newName });
		await ms(100);
		console.log("-- Completed Rename! --", { id, newName });
		if (Math.random() > 0.9) {
			console.log(" |> Rename was a failure :(");
			return {
				error: true,
				message:
					"Failed to rename file because random number was greater than 0.9"
			};
		}
		console.log(" |> Rename was success!");
		return { error: false };
	}
	async createFile(
		name: string,
		initialCont?: string
	): Promise<ConnectionResultError | { error: false; id: string }> {
		console.log("-- Started Creating File --", { name, initialCont });
		await ms(100);
		console.log("-- Completed Create! --", { name, initialCont });
		if (Math.random() > 0.9) {
			console.log(" |> Create was a failure :(");
			return {
				error: true,
				message:
					"Failed to create file because random number was greater than 0.9"
			};
		}
		console.log(" |> Create was success!");
		return { error: false, id: `id${Math.random()}` };
	}
}

export class File {
	fm: FileManager;
	name: string;
	webID: string | undefined;
	private getWebIDCallback: ((id: string | undefined) => void)[];
	status: { loading: number };
	shouldSave: boolean;
	fileText: string | undefined;

	private _eventhandlers: (() => void)[];
	private _erroreventhandlers: ((error: Error) => void)[];

	constructor(fileManager: FileManager) {
		this.fm = fileManager;
		this.name = `__unnamed_${i++}`;
		this.shouldSave = false;
		this._eventhandlers = [];
		this._erroreventhandlers = [];
		this.status = { loading: 0 };
		this.getWebIDCallback = [];

		this.fm._registerFile(this);
	}
	onChange(handler: () => void) {
		this._eventhandlers.push(handler);
	}
	onError(handler: (error: Error) => void) {
		this._erroreventhandlers.push(handler);
	}
	private _didChange() {
		console.log("calling change handlers");
		this._eventhandlers.forEach(handler => handler());
	}
	private _didError(error: Error) {
		this._erroreventhandlers.forEach(handler => handler(error));
	}
	id(): Promise<string> | string {
		console.log("getting an id");
		if (!this.shouldSave) {
			throw new Error("Trying to get an id but should not save.");
		}
		console.log("checking webid");
		if (this.webID) {
			console.log(`have ${this.webID}; returning`);
			return this.webID;
		}
		console.log(`no webid; returning promise`);
		return new Promise((resolve, reject) => {
			this.getWebIDCallback.push(id => {
				if (!id) {
					this._didError(new Error("Failed to create file."));
					reject(
						new Error(
							"Creating the file failed and so there is no id."
						)
					);
				}
				resolve(id);
			});
		});
	}
	rename(newName: string) {
		if (this.fm._filenameTaken(newName)) {
			throw new FilenameTakenError(newName);
		}
		this.name = newName;
		this._didChange();

		if (this.shouldSave) {
			this.status.loading++;
			this._didChange();
			(async () => {
				const renameResult = await this.fm.connection.renameFile(
					await this.id(),
					this.name
				);
				this.status.loading--;
				this._didChange();
				if (renameResult.error) {
					this._didError(new Error(renameResult.message));
					return;
				}
				this._didChange();
			})();
		}
	}
	// make this file into a real file.
	create(name: string) {
		if (this.fm._filenameTaken(name)) {
			throw new FilenameTakenError(name);
		}
		this.name = name;
		this.shouldSave = true;

		this.status.loading++;
		this._didChange();
		(async () => {
			const createResult = await this.fm.connection.createFile(
				name,
				this.fileText
			);
			this.status.loading--;
			this._didChange();
			if (createResult.error) {
				this._didError(new Error(createResult.message));
				this.shouldSave = false;
				this.getWebIDCallback.forEach(cb => cb(undefined));
				return;
			}
			const id = createResult.id;
			this.webID = id;
			this.getWebIDCallback.forEach(cb => cb(id));
			this._didChange();
		})();
	}
	save(newCont: string) {
		this.fileText = newCont;
		this._didChange();

		if (this.shouldSave) {
			this.status.loading++;
			this._didChange();
			(async () => {
				if (this.fileText === undefined) {
					throw new Error("Trying to save a file without text");
				}
				const saveResult = await this.fm.connection.saveFile(
					await this.id(),
					this.fileText
				);
				this.status.loading--;
				this._didChange();
				if (saveResult.error) {
					this._didError(new Error(saveResult.message));
					return;
				}
				this._didChange();
			})();
		}
	}
}

export class FileManager {
	connection: Connection;
	filesByName: { [name: string]: File | undefined };
	constructor(connection: Connection) {
		this.connection = connection;
		this.filesByName = {};
	}
	newFile(): File {
		return new File(this);
	}
	_filenameTaken(filename: string) {
		return !!this.filesByName[filename];
	}
	_registerFile(file: File) {
		if (this._filenameTaken(file.name)) {
			throw new FilenameTakenError(file.name);
		}
		this.filesByName[file.name] = file;
	}
}
