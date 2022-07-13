import React,{useState} from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { ContractPromise } from "@polkadot/api-contract";
import {Container,Button,Row,Col,Form} from 'react-bootstrap';
import tokenABI from "../contracts/token.json";
import BigNumber from "bignumber.js";

const Tokens = (props) => {
    const [textValue, setTextValue] = useState('');
    const [tokenAddress,setTokenAddress] = useState('');
    const [disableDisperse,setDisableDisperse] = useState(true);
    const [disableApprove,setDisableApprove] = useState(false);
    const [addressArray,setAddressArray] = useState([]);
    const [amountArray, setAmountArray] = useState([]);
    const [displayMessage,setDisplayMessage] = useState(null);

    console.log(props.contractAddress);

    const ph = "Address1 Amount1\n"+
    "Address2,Amount2\n"+
    "Address3:Amount3";

    const handleChange = (e) => {
        setTextValue(e.target.value);
    }

    const handleInput = (e) => {
        setTokenAddress(e.target.value);
    }

    const handleApprove = async () => {
        let tempArray = textValue.valueOf().split(/[\s,;:\t\r\n]+/);

        const wsProvider = new WsProvider(props.rpcURL);
        const api = await ApiPromise.create({ provider: wsProvider });
        const tokenContract = new ContractPromise(api, tokenABI, tokenAddress);

        let oddArray = tempArray.filter((v,i) => i%2);
        let evenArray = tempArray.filter((v,i) => !(i%2));

        let addArray = [];
        let amtArray = [];
        let total = 0.0;

        const cd = await api.registry.chainDecimals;
        const UNIT = Math.pow(10,parseInt(cd.toString()));

        for (let i = 0; i < evenArray.length; ++i) {
            if (!isNaN(oddArray[i]) && (parseFloat(oddArray[i]) > 0.0 )) {
                addArray.push(evenArray[i].trim());
                let t3 = new BigNumber(oddArray[i]);
                amtArray.push((t3.multipliedBy(UNIT)).toFixed());
                total += parseFloat(oddArray[i]);
            }
        }

        setAddressArray(addArray);
        setAmountArray(amtArray);

        console.log(total);

        let t2 = new BigNumber(total);
        
        let allowance = (t2.multipliedBy(UNIT)).toFixed();
        console.log(allowance);
        console.log(tokenAddress);
        console.log(addArray);
        console.log(amtArray);

        const gasLimit = -1;

        console.log(props.disperseContract);

        await tokenContract.tx["psp22::approve"]({gasLimit},props.contractAddress,allowance)
        .signAndSend(props.activeAccount.address,{signer: props.signer}, result => {
            if (result.status.isInBlock) {
                setDisplayMessage("Transaction is In Block");
                console.log(`Completed at block hash #${result.isInBlock.toString()}`);
            } else if (result.status.isFinalized) {
                setDisplayMessage("Transaction is Finalized");
                console.log(`Current status: ${result.type}`);
                setDisableDisperse(false);
            }
            
        }).catch((error) => {
            console.log(':( transaction failed', error);
        });

    }

    const handleDisperse = async () => {
        setDisableApprove(true);
        setDisplayMessage("");

        const gasLimit = -1;

        if ((addressArray.length === amountArray.length) && addressArray.length > 0) {
            await props.disperseContract.tx.disperseToken({gasLimit},tokenAddress,addressArray,amountArray)
            .signAndSend(props.activeAccount.address,{signer: props.signer}, result => {
                if (result.status.isInBlock) {
                    setDisplayMessage("Transaction is In Block");
                    console.log(`Completed at block hash #${result.isInBlock.toString()}`);
                } else if (result.status.isFinalized) {
                    setDisplayMessage("Transaction is Finalized");
                    console.log(`Current status: ${result.type}`);
                    setDisableApprove(false);
                    setDisableDisperse(true);
                }
            }).catch((error) => {
                setDisplayMessage("Transaction Failed");
                console.log(':( transaction failed', error);
            });
        } else {
            alert("Please enter at least one valid transaction");
        }

        setAddressArray([]);
        setAmountArray([]);
    
    }
    

    return (
        <Container>
            <Row>
                <Col xs="3">
                </Col>
                <Col xs="6" className="text-center">
                    <h2>Disperse Tokens</h2>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>
                            Please enter Contract Address
                            </Form.Label>
                            <Form.Control onChange={handleInput} type="text" placeholder="ERC20/PSP22 Contract Address" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>
                            Please enter each address in a new line followed by a separator (comma,colon or blank space) and then the amount.
                            </Form.Label>
                            <Form.Control onChange={handleChange} placeholder={ph} as="textarea" />
                            <br />
                            <Button variant="primary" onClick={handleApprove} disabled={disableApprove}>
                                Approve Tokens</Button>{'     '}
                            <Button variant="primary" onClick={handleDisperse} disabled={disableDisperse}>
                                Disperse Tokens</Button>{'     '}
                        </Form.Group>
                        <Form.Group>
                            {displayMessage}
                        </Form.Group>
                    </Form>
                </Col>
                <Col xs="3">
                    
                </Col>

            </Row>
            
        </Container>
    )
}

export default Tokens;