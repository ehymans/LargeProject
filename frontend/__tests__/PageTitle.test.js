import { render, screen } from '@testing-library/react'
import PageTitle from '../components/PageTitle';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom'

test("PageTitle renders successfully", () => {
render(
  <BrowserRouter>
    <PageTitle/>
  </BrowserRouter>);

    const element = screen.getByText('Dare2Do', { exact: true  });

    expect(element).toBeInTheDocument();
})