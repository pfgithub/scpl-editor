import React from "react";

type KeyNames = "save" | "closePanel" | "export";

export const keys: {
	[key in KeyNames]: (e: React.KeyboardEvent) => boolean
} = {
	save: (e: React.KeyboardEvent) => {
		if (
			e.nativeEvent.code === "KeyS" &&
			(e.ctrlKey || e.metaKey) &&
			!e.shiftKey &&
			!e.altKey
		) {
			e.preventDefault();
			e.stopPropagation();
			return true;
		}
		return false;
	},
	closePanel: (e: React.KeyboardEvent) => {
		if (
			e.nativeEvent.code === "Escape" &&
			!(e.ctrlKey || e.metaKey) &&
			!e.shiftKey &&
			!e.altKey
		) {
			e.preventDefault();
			e.stopPropagation();
			return true;
		}
		return false;
	},
	export: (e: React.KeyboardEvent) => {
		if (
			e.nativeEvent.code === "KeyS" &&
			(e.ctrlKey || e.metaKey) &&
			e.shiftKey &&
			!e.altKey
		) {
			e.preventDefault();
			e.stopPropagation();
			return true;
		}
		return false;
	}
};
