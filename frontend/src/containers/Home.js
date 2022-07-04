import React,{useState,useEffect,useCallback} from "react";
import {Button, Card, Row, Col, Form} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Home = (props) => {
    const [active,setActive] = useState(null);
    const [sChoices,setSChoices] = useState([]);
    const navigate = useNavigate();
    const handleOnNative = useCallback(() => navigate('/native', {replace: true}), [navigate]);
    const handleOnTokens = useCallback(() => navigate('/tokens', {replace: true}), [navigate]);

    console.log("active",active);
    console.log("schoices",sChoices);

    const check_account = async () => {
        if (props?.activeAccount?.address) {
            setActive(props.activeAccount.address);
        }
    }

    useEffect(() => {
        check_account();
    },[props.activeAccount])

    const check_all = async() => {
        if (props.allAccounts.length > 0) {
            setSChoices([]);
            props.allAccounts.map(accounts => setSChoices(sChoices => [...sChoices,
            {
                name: accounts.address,
                value: accounts.address,
            }]))
            //console.log("length",props.allAccounts.length);
        }
    }

    useEffect(() => {
        check_all();
    },[props.allAccounts])

    if (!active) {
        return(
            <p>Install Polkadot Extension</p>
        )
    } else {
        return (
            <Row> 
                <Col xs="3">
                </Col>
                <Col xs="6">
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>
                                DISPERSE DAPP
                            </Card.Title>
                            <Card.Text>
                                {active}
                            </Card.Text>
                            <Form.Select>
                                <option>Select Another Account</option>
                                {sChoices.map(choice => (<option value={choice.value}>{choice.name}</option>))}
                            </Form.Select>
                            <br />
                            <Button variant="primary" onClick={handleOnNative}>Disperse Currency</Button>{'     '}
                            <Button variant="primary" onClick={handleOnTokens}>Disperse Tokens</Button>{'     '}
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs="3">
                </Col>
            </Row>
        )
    }

    
}

export default Home;