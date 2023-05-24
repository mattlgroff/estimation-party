import { render, screen, fireEvent, act } from '@testing-library/react';
import CopyToClipboard, { CopyToClipboardProps } from './index';
import { useState as useStateMock } from 'react';

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn(),
}));

const setShowToastMock = jest.fn();

beforeEach(() => {
    (useStateMock as jest.Mock).mockImplementation(init => [init, setShowToastMock]);
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('CopyToClipboard', () => {
    const props: CopyToClipboardProps = {
        textToCopy: 'Sample text',
    };

    it('should render without crashing', () => {
        render(<CopyToClipboard {...props} />);
        expect(screen.getByText(/📋/i)).toBeInTheDocument();
    });

    it('should display toast when the button is clicked', async () => {
        // Use real timers
        jest.useRealTimers();

        Object.assign(navigator, {
            clipboard: {
                writeText: jest.fn().mockResolvedValue(undefined),
            },
        });

        render(<CopyToClipboard {...props} />);

        // Use act to group state updates
        await act(async () => {
            fireEvent.click(screen.getByText(/📋/i));
        });

        // State should have been updated with true
        expect(setShowToastMock).toHaveBeenCalledWith(true);
    });
});
