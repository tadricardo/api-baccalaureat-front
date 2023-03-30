import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { withRouter } from "react-router-dom";

const TEST_SITE_KEY = "6LcofAMfAAAAAL25japw6qrBI9JxzZfvk844F1UO";
const DELAY = 1500;

class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
            load: false,
            expired: false,
            isCaptchaOk: false,
        };
        this._reCaptchaRef = React.createRef();
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ load: true });
        }, DELAY);
    }

    captcha = (value) => {
        this.setState({ value });
        if (value !== null)
            this.setState({ isCaptchaOk: true });
    };

    render() {
        const { load, isCaptchaOk } = this.state || {};
        return (
            <>
                <div>isCaptchaOk : {isCaptchaOk.toString()}</div>
                <div className="App">
                    {load && (
                        <ReCAPTCHA
                            style={{ display: "inline-block" }}
                            theme="dark"
                            ref={this._reCaptchaRef}
                            sitekey={TEST_SITE_KEY}
                            onChange={this.captcha}
                            asyncScriptOnLoad={this.asyncScriptOnLoad}
                        />
                    )}
                </div>
            </>
        );
    }
}

export default withRouter(Test);