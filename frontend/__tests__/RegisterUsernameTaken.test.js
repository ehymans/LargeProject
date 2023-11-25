import React from 'react'
import { render, screen } from '@testing-library/react'
import Register from '../components/Register';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom'
import user from "@testing-library/user-event";
import '@testing-library/jest-dom';
import { act } from '@testing-library/react';
import { fireEvent, cleanup } from '@testing-library/react';

import axios from 'axios';

jest.mock('axios');

test("Register username taken", async () => {

    const users = {exists: true};
    const resp = {data: users};

    axios.get.mockResolvedValue(resp);


    //console.log("hello from the top of the test");

    render(
    <BrowserRouter>
        <Register/>
    </BrowserRouter>);

const nameInput = screen.getByPlaceholderText('First Name');
const lastInput = screen.getByPlaceholderText('Last Name');
const userInput = screen.getByPlaceholderText('Username');
const emailInput = screen.getByPlaceholderText('Email');
const passInput = screen.getByPlaceholderText('Password');
const conPassInput = screen.getByPlaceholderText('Confirm Password');

act( () => {
    fireEvent.change(userInput, { target: { value: "Rafael" }});

    fireEvent.click(screen.getByText("SUBMIT"));
  });

 // console.log("hello from after the act!");
  
    const element = await screen.findByText('Username is already taken!');

    expect(element).toBeInTheDocument();
})
