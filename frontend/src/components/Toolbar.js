import React,{useState} from 'react';
import {NavDropdown,Navbar,Nav,Button,Container} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Toolbar = () => {

    return (
        <Navbar bg="info" expand="lg py-0">
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand ><p className='text-light'>Disperse</p></Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className="justify-content-end">
                <Nav>
                    <LinkContainer to="/native"><Nav.Link ><p className='text-light'>Currency</p></Nav.Link></LinkContainer>
                    <LinkContainer to="/tokens"><Nav.Link><p className='text-light'>Tokens</p></Nav.Link></LinkContainer>
                </Nav>
                </Navbar.Collapse>
            </Container>
            </Navbar>
    )
}

export default Toolbar;