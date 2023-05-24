import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LeadControlsModal from './index';

describe('LeadControlsModal', () => {
    const onCloseMock = jest.fn();
    const onSubmitMock = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the modal when isOpen is true', () => {
        render(<LeadControlsModal isOpen={true} onClose={onCloseMock} onSubmit={onSubmitMock} />);
        expect(screen.getByText('Start Estimation')).toBeInTheDocument();
    });

    it('should not render the modal when isOpen is false', () => {
        render(<LeadControlsModal isOpen={false} onClose={onCloseMock} onSubmit={onSubmitMock} />);
        expect(screen.queryByText('Start Estimation')).not.toBeInTheDocument();
    });

    it('should call the onClose prop when the Cancel button is clicked', () => {
        render(<LeadControlsModal isOpen={true} onClose={onCloseMock} onSubmit={onSubmitMock} />);
        fireEvent.click(screen.getByText('Cancel'));
        expect(onCloseMock).toHaveBeenCalled();
    });

    it('should call the onSubmit prop when the form is submitted', () => {
        render(<LeadControlsModal isOpen={true} onClose={onCloseMock} onSubmit={onSubmitMock} />);

        fireEvent.change(screen.getByLabelText('Ticket Name'), { target: { value: 'Test Ticket' } });
        fireEvent.change(screen.getByLabelText('Link to Ticket (optional)'), { target: { value: 'https://example.com' } });

        fireEvent.click(screen.getByText('Start'));

        expect(onSubmitMock).toHaveBeenCalledWith('Test Ticket', 'https://example.com');
    });
});
