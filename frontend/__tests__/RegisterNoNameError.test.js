import React from 'react'
import { render, screen } from '@testing-library/react'
import Register from '../components/Register';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom'
import user from "@testing-library/user-event";
import '@testing-library/jest-dom';
import { act } from '@testing-library/react';

/*test("Register renders successfully", () => {
render(
  <BrowserRouter>
    <Register/>
  </BrowserRouter>);

    const element = screen.getByText('REGISTER', { exact: true  });
    expect(element).toBeInTheDocument();
})*/

test("Register click no name", async () => {

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
/*user.type(nameInput, "");
user.type(lastInput, "");
user.type(userInput, "");
user.type(emailInput, "");
user.type(passInput, "");
user.type(conPassInput, "");*/

  user.click(screen.getByText("SUBMIT"));
});

    const element = screen.getByText('Username is required!', { exact: true  });
    expect(element).toBeInTheDocument();
})
