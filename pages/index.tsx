import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import config from '../config.json';
import swal from 'sweetalert';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/App.css';

const RSK_TESTNET_CHAIN = 31;

function App() {
  //Hooks
  const [captcha, setCaptcha] = useState({ id: '', png: '' });
  const [dispenseAddress, setDispenseAddress] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');
  const [clickable, setClickable] = useState(true);

  const fetchCaptcha = async () => {
    const result = await axios.post(config.NEW_CAPTCHA_URL);
    setCaptcha(result.data);
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  //Methods
  const handleFaucetButtonClick = async () => {
    if (clickable) {
      axios
        .post(config.API_URL + '/dispense', {
          dispenseAddress,
          captcha: {
            solution: captchaValue,
            id: captcha.id
          }
        })
        .then(res => {
          //check why 204 doesn't have any data
          swal(res.data.modalTitle, res.data.message, res.data.modalStatus);
        })
        .catch(e => {
          //codes 409 or 500
          console.error(JSON.stringify(e.response));
          swal(e.response.data.modalTitle, e.response.data.message, e.response.data.modalStatus);
        });
    }
  };
  const handleCaptchaValueChange = (event: any) => {
    setCaptchaValue(event.target.value);
  };
  const handleDispenseAddressChange = (event: any) => {
    setDispenseAddress(event.target.value);
  };

  return (
    <div className="background">
      <Navbar className="navbar-rsk">
        <Navbar.Brand>
          <img className="logo" />
        </Navbar.Brand>
      </Navbar>
      <body className="app-body">
        <Container className="faucet-container">
          <Row>
            <Col className="col-centerer">
              <Form.Label>Enter your testnet address or RNS name</Form.Label>
            </Col>
          </Row>
          <Row>
            <Col className="col-centered">
              <Form.Control
                type="input"
                placeholder="Address"
                value={dispenseAddress}
                onChange={handleDispenseAddressChange}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col className="col-centered">
              <img className="captcha-image" src={`data:image/png;base64,${captcha.png}`} />
            </Col>
          </Row>
          <br />
          <br />
          <Row>
            <Col className="col-centered">
              <Form.Control
                className="faucet-input"
                type="input"
                placeholder="Captcha"
                value={captchaValue}
                onChange={handleCaptchaValueChange}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col className="col-centered">
              <Button variant={'success'} onClick={handleFaucetButtonClick}>
                Get test RBTC
              </Button>
            </Col>
          </Row>
        </Container>
      </body>
    </div>
  );
}

export default App;
