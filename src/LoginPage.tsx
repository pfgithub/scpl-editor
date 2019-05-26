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
				<div>You have been logged in. You can now close ths page.</div>
			);
		}
		return <div>You are being logged in...</div>;
	}
}

export default LoginPage;
