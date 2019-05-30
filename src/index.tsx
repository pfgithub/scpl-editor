import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

const searchParams = new URLSearchParams(location.search);
const loginkey = searchParams.get("login_key");
if (loginkey) {
	const LoginPage = lazy(() => import("./LoginPage"));

	ReactDOM.render(
		<Suspense fallback={
			<div className="login-progress">
				<div>
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
					<p style={{ display: "none" }}>Loading Login...</p>
				</div>
			</div>
		}>
			<LoginPage loginkey={loginkey} />
		</Suspense>,
		document.getElementById("root")
	);
} else {
	const App = lazy(() => import("./App"));

	ReactDOM.render(
		<Suspense fallback={
			<div className="login-progress">
				<div>
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
					<p style={{ display: "none" }}>Loading ScPL Editor...</p>
				</div>
			</div>
		}>
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
