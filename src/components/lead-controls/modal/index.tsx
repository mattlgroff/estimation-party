// components/Modal.tsx
import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (ticketName: string, ticketHref: string) => void;
}

const LeadControlsModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const ticketName = (e.target as any).ticketName.value;
        const ticketHref = (e.target as any).ticketHref.value;

        onSubmit(ticketName, ticketHref);
    };

    return (
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
            <div className="rounded-lg bg-white p-4">
                <h2 className="mb-2 text-xl font-bold">Start Estimation</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="ticketName" className="mb-2 block text-sm font-bold text-gray-700">
                            Ticket Name
                        </label>
                        <input
                            id="ticketName"
                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                            type="text"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="ticketHref" className="mb-2 block text-sm font-bold text-gray-700">
                            Link to Ticket (optional)
                        </label>
                        <input
                            id="ticketHref"
                            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                            type="text"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button type="submit" className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                            Start
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeadControlsModal;
