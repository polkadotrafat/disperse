import React from "react";
import {Container,Button,Row,Col,Form} from 'react-bootstrap';

const Native = () => {

    const handleClick = async (e) => {
        e.preventDefault();
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
                        <Form.Control as="textarea" />
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