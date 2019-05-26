import React, { Component } from "react";
import "./LoginPage.css";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type LoginPageProps = { loginkey: string };

class LoginPage extends Component<
	LoginPageProps,
	{ status: "progress" | "done" }
> {
	constructor(props: Readonly<LoginPageProps>) {
		super(props);

		this.state = { status: "progress" };
	}
	componentDidMount() {
		// start login process
		this.startLogin();
	}
	async startLogin() {
		await delay(1000);
		localStorage.setItem("login_token", `login${this.props.loginkey}`);
		this.setState({ status: "done" });
		await delay(500);
		window.close();
	}
	render() {
		if (this.state.status === "done") {
			return (
				<div className="login-progress">
					<div>
						<div className="login-success"></div>
						<p><b>You have been logged in.</b> You may now close this page.</p>
					</div>
				</div>
			);
		}
		return (
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
					<p>You are being logged in...<b>Do not close this page.</b></p>
				</div>
			</div>
		);
	}
}

export default LoginPage;
