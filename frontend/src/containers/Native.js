import React,{useState} from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import {Container,Button,Row,Col,Form} from 'react-bootstrap';
import {BigNumber} from "bignumber.js";

const Native = (props) => {
    const [textValue, setTextValue] = useState('');

    const ph = "Address1 Amount1\n"+
    "Address2,Amount2\n"+
    "Address3:Amount3";

    console.log(textValue);


    const handleClick = async () => {
        const wsProvider = new WsProvider(props.rpcURL);
        const api = await ApiPromise.create({ provider: wsProvider });
        let tempArray = textValue.valueOf().split(/[\s,;:\t\r\n]+/);

        const cd = await api.registry.chainDecimals;
        console.log("chain decimals",cd);
        const UNIT = Math.pow(10,parseInt(cd.toString()));
        let oddArray = tempArray.filter((v,i) => i%2);
        let evenArray = tempArray.filter((v,i) => !(i%2));

        let addArray = [];
        let amtArray = [];
        let total = 0.0;

        for (let i = 0; i < evenArray.length; ++i) {
            if (!isNaN(oddArray[i]) && (parseFloat(oddArray[i]) > 0.0 )) {
                addArray.push(evenArray[i].trim());
                let t3 = new BigNumber(oddArray[i]);
                amtArray.push((t3.multipliedBy(UNIT)).toFixed());
                total += parseFloat(oddArray[i]);
            }
        }

        let t2 = new BigNumber(total);

        let value = (t2.multipliedBy(UNIT)).toString();
        console.log(value);

        //let ADDR = props.activeAccount.address;

        //const { nonce, data: balance } = await api.query.system.account(ADDR);

        //let a = new BN(balance.free);
        //let b = new BN(UNIT);
        //let avBal = a.div(b);

        //console.log(`balance of ${a.div(b)} and a nonce of ${nonce}`);

        const gasLimit = -1;

        console.log(props.signer);
        console.log(addArray,amtArray);

        await props.disperseContract.tx.disperseCurrency({gasLimit,value},addArray,amtArray)
        .signAndSend(props.activeAccount.address,{signer: props.signer}, result => {
            if (result.status.isInBlock) {

              console.log('in a block');
            } else if (result.status.isFinalized) {
              console.log('finalized');
            }
          });
        
    }

    const handleChange = (e) => {
        setTextValue(e.target.value);
    }

    return (
        <Container>
            <Row>
                <Col xs="3">
                </Col>
                <Col xs="6" className="text-center">
                    <h2>Disperse Currency</h2>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>
                            Please enter each address in a new line followed by a separator (comma,colon or blank space) and then the amount.
                            </Form.Label>
                        </Form.Group>
                        <Form.Control placeholder={ph} as="textarea" onChange={handleChange} />
                        <br />
                        <Button variant="primary" onClick={handleClick}>Disperse Currency</Button>
                    </Form>
                </Col>
                <Col xs="3">
                    
                </Col>

            </Row>
            
        </Container>
    )
}

export default Native;