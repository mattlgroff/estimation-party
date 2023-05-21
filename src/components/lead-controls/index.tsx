import React, { useState } from 'react';
import Modal from '@deps/components/lead-controls/modal';
import { Room } from '@deps/types';

interface LeadControlsProps {
    estimationInProgress: boolean;
    room: Room;
}

const LeadControls: React.FC<LeadControlsProps> = ({ estimationInProgress, room }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const startEstimation = async (ticketName: string, ticketHref: string) => {
        const res = await fetch('/api/start-estimation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                room_id: room?.id,
                ticket_name: ticketName,
                ticket_href: ticketHref,
            }),
        });

        const { success } = await res.json();

        if (success) {
            setModalOpen(false);
            // At this point the realtime subscription will update the UI for everyone listening to start the estimation
        } else {
            alert('Sorry, there was an error starting the estimation. Please try again.');
        }
    };

    const stopEstimation = async () => {
        const res = await fetch('/api/stop-estimation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                room_id: room?.id,
            }),
        });

        const { success } = await res.json();

        if (success) {
            // At this point the realtime subscription will update the UI for everyone listening to stop the estimation
        } else {
            alert('Sorry, there was an error stopping the estimation. Please try again.');
        }
    };

    const handleEstimationToggle = () => {
        if (estimationInProgress) {
            stopEstimation();
        } else {
            setModalOpen(true);
        }
    };

    return (
        <div>
            <h2 className="mb-4 text-2xl font-bold">You are the lead!</h2>
            <button onClick={handleEstimationToggle} className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                {estimationInProgress ? 'Reveal Estimations' : 'Begin Estimations'}
            </button>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSubmit={startEstimation} />
        </div>
    );
};

export default LeadControls;
