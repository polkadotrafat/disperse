import React from "react";
import {Container,Button,Row,Col,Form} from 'react-bootstrap';

const Tokens = () => {

    const handleClick = async (e) => {
        e.preventDefault();
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
                            <Form.Control type="text" placeholder="ERC20/PSP22 Contract Address" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>
                            Please enter each address in a new line followed by a separator (comma,colon or blank space) and then the amount.
                            </Form.Label>
                            <Form.Control as="textarea" />
                            <br />
                            <Button variant="primary" onClick={handleClick}>Disperse Tokens</Button>
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