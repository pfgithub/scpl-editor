const ms = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export type ConnectionDetails =
	| { enabled: false }
	| { enabled: true; type: "scplserver"; server: string; token: string }
	| { enabled: true; type: "fake" };

export class FilenameTakenError extends Error {
	filename: string;
	constructor(filename: string) {
		super(`Filename already in use: \`${filename}\``);
		this.name = "FilenameTakenError";
		this.filename = filename;
	}
}

export type TaskCompletion = {};

interface Connection {
	tasks: Task[];
	addTask(task: Task): void;
	executeTask(task: Task): Promise<TaskCompletion>;
}

export class FakeConnection implements Connection {
	tasks: Task[];
	constructor() {
		this.tasks = [];
	}
	addTask(task: Task) {
		this.tasks.push(task);
		// if less than 10 tasks
		this.executeTask(task);
	}
	async executeTask(task: Task): Promise<TaskCompletion> {
		await ms(1000);
		if (Math.random() > 0.9) {
			// fail task
		} else {
			/// succeed task
		}
		return {};
	}
}

class Task<T> extends Promise<T> {}

// Create a file and save it to the server
class CreateFileTask {}

class UpdateFileListTask {}

//fileManager.on("taskComplete", (task, completion) => {})

export class FileManager {
	connection?: Connection;
	tasks: Task[];

	constructor(connection?: Connection) {
		this.tasks = [];
		this.connection = connection;

		this.connection && this.connection.addTask(new UpdateFileListTask());
	}

	static genID() {
		const uintarr = new Uint8Array(20);
		crypto.getRandomValues(uintarr);
		const id = new Buffer(uintarr).toString("hex");
		return id;
	}

	startCreateFile(filename: string): string | FilenameTakenError {
		return FileManager.genID();
	}

	watch(fileID: string, onStateChange: () => {}) {}
}
