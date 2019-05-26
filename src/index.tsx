import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

const searchParams = new URLSearchParams(location.search);
const loginkey = searchParams.get("login_key");
if (loginkey) {
	const LoginPage = lazy(() => import("./LoginPage"));

	ReactDOM.render(
		<Suspense fallback={<div>Loading login...</div>}>
			<LoginPage loginkey={loginkey} />
		</Suspense>,
		document.getElementById("root")
	);
} else {
	const App = lazy(() => import("./App"));

	ReactDOM.render(
		<Suspense fallback={<div>Loading ScPL Editor...</div>}>
			<App />
		</Suspense>,
		document.getElementById("root")
	);

	// Enable navigation prompt
	window.onbeforeunload = () => {
		return true;
	};
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
