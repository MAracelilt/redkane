import React from "react";
import { myFetch, generateAccountFromToken } from "../../../utils";
import { IAccount } from "../../../interfaces/IAccount";
import { SetAccountAction } from "../../../redux/actions";
import { connect } from "react-redux";
import "./Login.css";

interface IProps {
  notRegister():void
}

interface IGlobalActionProps {
  setAccount(account: IAccount): void;
}

interface IState {
  email: string;
  password: string;
  error: string;
}

type TProps = IProps & IGlobalActionProps;

class Login extends React.PureComponent<TProps, IState> {
  notRegister: any;
  constructor(props: TProps) {
    super(props);

    this.state = {
      email: "",
      password: "",
      error: ""
    };

    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.login = this.login.bind(this);
    
  }

  onEmailChange(event: any) {
    const email = event.target.value;
    console.log(email);
    this.setState({ email, error: "" });
  }

  onPasswordChange(event: any) {
    const password = event.target.value;
    console.log(password);
    this.setState({ password, error: "" });
  }

  login() {
    console.log("entro");
    const { setAccount } = this.props;
    const { email, password } = this.state;
    myFetch({
      path: "/users/login",
      method: "POST",
      json: { email, password }
    }).then(json => {
      if (json) {
        const {
          token,
          avatar,
          banner,
          surname,
          profession,
          about_me,
          name
        } = json;
        localStorage.setItem("token", token);
        localStorage.setItem("avatar", avatar);
        setAccount(
          generateAccountFromToken({
            token,
            avatar,
            banner,
            name,
            surname,
            profession,
            password,
            about_me
          })
        );
      } else {
        this.setState({ error: "Credenciales inválidas" });
        window.alert("Invalid email or password");
      }
    });
  }

  render() {
    const { email, password } = this.state;
    const { notRegister } = this.props;
    return (
      <>
            <div className="container animated bounceInLeft delay-0.5s slow">
              <div className="row centered-form">
                <div className="card loginCard">
                  <div className="card-body">
                    <h3>Sign In</h3>
                    <div className="form-group">
                      <label>Email address</label>
                      <input
                        className="form-control mr-sm-1"
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={this.onEmailChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Password</label>
                      <input
                        className="form-control mr-sm-1"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={this.onPasswordChange}
                      />
                    </div>

                    <button
                      className="btn text-light loginButton btn-block my-2 my-sm-0"
                      disabled={password.length === 0 || email.length === 0}
                      onClick={this.login}
                    >
                      Login
                    </button>
                    <p className="forgot-password text-right">
                      Don't have an account? <a href="#" onClick={() =>notRegister()}>register!</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
      </>
    );
  }
}

const mapDispatchToProps: IGlobalActionProps = {
  setAccount: SetAccountAction
};

export default connect(null, mapDispatchToProps)(Login);