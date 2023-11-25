import { render, screen } from '@testing-library/react'
import LandingHeader from '../components/LandingHeader';
import '@testing-library/jest-dom/extend-expect';

test("LandingHeader renders successfully", () => {
    render(<LandingHeader/>);

    const element = screen.getByText('Dare2Do', { exact: true  });

    expect(element).toBeInTheDocument();
})