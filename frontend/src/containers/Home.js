import React,{useState,useEffect,useCallback} from "react";
import {Button, Card, Row, Col, Form} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Front from "../components/Front";

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
                            <Form.Label>
                                Select Another Account
                            </Form.Label>
                            <Form.Select onChange={props.onHandleSelect}>
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