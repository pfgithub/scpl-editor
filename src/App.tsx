import React, { Component } from "react";

import { GlobalEditorComponent } from "./GlobalEditorComponent";

type AppProps = {};
class App extends Component<{}, {}> {
	render() {
		return (
			<div>
				<GlobalEditorComponent />
			</div>
		);
	}
}

export default App;
