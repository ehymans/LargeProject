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

/*test("Register renders successfully", () => {
render(
  <BrowserRouter>
    <Register/>
  </BrowserRouter>);

    const element = screen.getByText('REGISTER', { exact: true  });
    expect(element).toBeInTheDocument();
})*/

test("Register click no name", async () => {

    const users = {exists: false};
    const resp = {data: users};

    axios.get.mockResolvedValue(resp);


    //console.log("hello from the top of the test");

    /*const nullstring = ""

    jest
     .spyOn(React, 'useState')
     .mockReturnValueOnce([nullstring, {}])     // registerFirstName
     /*.mockReturnValueOnce([nullstring, {}])     // registerLastName
     .mockReturnValueOnce([nullstring, {}])     // registerUsername
     .mockReturnValueOnce([nullstring, {}])     // registerEmail
     .mockReturnValueOnce([nullstring, {}])     // registerPassword
     .mockReturnValueOnce([nullstring, {}])     // message
     .mockReturnValueOnce([nullstring, {}])     // passwordStrength
     .mockReturnValueOnce([nullstring, {}])     // confirmPassword
     .mockReturnValueOnce([true, {}])           // verifyEmail
     .mockReturnValueOnce([nullstring, {}])     // otpCode
     .mockReturnValueOnce([nullstring, {}])     // serverGeneratedCode
*/

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

//await userEvent.click(screen.getByText("SUBMIT"));
act( () => {
    fireEvent.change(userInput, { target: { value: "Rafael" }});
/*user.type(nameInput, "a");
user.type(lastInput, "a");
user.type(userInput, "a");
user.type(emailInput, "a");
user.type(passInput, "a");
user.type(conPassInput, "a");*/

    // user.click(screen.getByText("SUBMIT"));
    fireEvent.click(screen.getByText("SUBMIT"));
  });

  //console.log("hello from after the act!");
  
//  const message = await screen.getByLabelText('message').toBe('Invalid email!');

    const element = await screen.findByText('Invalid email!');

    expect(element).toBeInTheDocument();
})
