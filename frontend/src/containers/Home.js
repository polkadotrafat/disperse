import React,{useState,useEffect,useCallback} from "react";
import {Button, Card, Row, Col, Form} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Front from "../components/Front";

const Home = (props) => {
    const [active,setActive] = useState(null);
    const [sChoices,setSChoices] = useState([]);
    const [sNetwork,setSNetwork] = useState([]);
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

    const check_all = () => {
        if (props?.allAccounts?.length > 0) {
            let temp = [];
            for ( let i = 0; i < props.allAccounts.length; ++i) {
                let obj = {value: i, name: props.allAccounts[i].address};
                temp.push(obj);
            }
            setSChoices(temp);
        }
    }

    useEffect(() => {
        check_all();
    },[props.allAccounts])

    const set_network = () => {
        if (props?.NAME_NETWORK?.length > 0) {
            let temp = [];
            for ( let i = 0; i < props.NAME_NETWORK.length; ++i) {
                let obj = {value: i, name: props.NAME_NETWORK[i]};
                temp.push(obj);
            }
            setSNetwork(temp);
        }
    }

    useEffect(() => {
        set_network();
    },[props.NAME_NETWORK])

    if (!active) {
        return(
            <Front />
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
                                Account : {active}
                            </Card.Text>
                            <Card.Text>
                                Balance : {props.balance}
                            </Card.Text>
                            <Card.Text>
                                Network : {props.networkName}
                            </Card.Text>
                            <Card.Text>
                                RPC URL : {props.rpcURL}
                            </Card.Text>
                            <Form.Label>
                                Select Another Account
                            </Form.Label>
                            <Form.Select onChange={props.onHandleSelect}>
                                {sChoices.map(choice => (<option value={choice.value}>{choice.name}</option>))}
                            </Form.Select>
                            <br />
                            <Form.Label>
                                Change Network
                            </Form.Label>
                            <Form.Select onChange={props.onHandleNetwork}>
                                {sNetwork.map(network => (<option value={network.value}>{network.name}</option>))}
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