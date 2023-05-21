import { useState } from 'react';
import Link from 'next/link';
import { Estimation, UserEstimation, User } from '@deps/types';

interface EstimationsProps {
    estimationInProgress: boolean;
    estimations: Estimation[];
    userEstimations: UserEstimation[];
    user: User;
    users: User[];
}

const Estimations: React.FC<EstimationsProps> = ({ estimationInProgress, estimations, userEstimations, user, users }) => {
    const [estimate, setEstimate] = useState('');

    const makeEstimate = async (event: React.FormEvent<HTMLFormElement>, estimate: string) => {
        event.preventDefault();

        if (!estimate) return;

        try {
            const res = await fetch('/api/make-estimate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    estimation_id: estimations[0].id,
                    user_id: user?.id,
                    estimate: estimate,
                }),
            });

            const { success, error } = await res.json();

            if (success) {
                setEstimate('');
                // TODO: Success Toast
            } else {
                throw new Error(error ? error : 'Sorry, there was an error making your estimate. Please try again.');
            }
        } catch (error) {
            console.error(error);
            alert(error);
            // TODO: Error Toast instead of Alert
        }
    };

    const unsure = async () => {
        try {
            const res = await fetch('/api/make-estimate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    estimation_id: estimations[0].id,
                    user_id: user?.id,
                    estimate: '?',
                }),
            });

            const { success, error } = await res.json();

            if (success) {
                setEstimate('');
                // TODO: Success Toast
            } else {
                throw new Error(error ? error : 'Sorry, there was an error making your estimate. Please try again.');
            }
        } catch (error) {
            console.error(error);
            alert(error);
            // TODO: Error Toast instead of Alert
        }
    };

    const userHasEstimated = userEstimations.find(
        userEstimation => userEstimation.user_id === user.id && userEstimation.estimation_id === estimations[0].id
    )?.estimate;

    return (
        <div className="lg:col-span-2">
            {estimationInProgress && estimations.length > 0 && (
                <div className="h-full rounded-md border border-gray-300 p-4">
                    <h3 className="mb-2 text-xl font-bold">Estimating Ticket: {estimations[0].ticket_name}</h3>
                    {estimations[0].ticket_href && (
                        <a
                            href={estimations[0].ticket_href}
                            className="mb-4 text-blue-500 hover:underline"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {estimations[0].ticket_href}
                        </a>
                    )}
                    <p className="mb-4">Let's make those estimates 🎊</p>
                    <p className="mb-4">
                        Choose a Fibonacci number 0, 1, 2, 3, 5, 8 , 13, 21, 34, 55, 89, 144... or click "I'm not sure or I have questions".
                    </p>
                    <form onSubmit={event => makeEstimate(event, estimate)}>
                        <input
                            className="mb-4 w-full rounded-md border border-gray-300 p-2"
                            type="text"
                            value={estimate}
                            onChange={e => setEstimate(e.target.value)}
                        />

                        <button className="mr-2 rounded-md bg-blue-500 px-4 py-2 text-white" type="submit">
                            {userHasEstimated ? 'Update Estimate' : 'Submit Estimate'}
                        </button>

                        <button className="rounded-md bg-red-500 px-4 py-2 text-white" onClick={unsure} type="button">
                            I'm not sure or I have questions
                        </button>
                    </form>

                    {userHasEstimated && <p className="mt-4">You have estimated: {userHasEstimated}</p>}
                </div>
            )}

            <div className="h-full rounded-md border border-gray-300 p-4">
                <h3 className="mb-2 text-xl font-bold">Past Estimates</h3>
                {estimations.map((estimation, index) => {
                    if (index === 0 && estimationInProgress) return; // Skip the first estimation (showcased one)
                    return (
                        <div key={estimation.id} className="mb-4">
                            <h4 className="text-lg font-semibold">{estimation.ticket_name}</h4>
                            {estimation.ticket_href && (
                                <Link href={estimation.ticket_href} className="mb-2 text-blue-500 hover:underline">
                                    {estimation.ticket_href}
                                </Link>
                            )}
                            <ul>
                                {userEstimations
                                    .filter(ue => ue.estimation_id === estimation.id)
                                    .map(ue => {
                                        const pastUser = users.find(u => u.id === ue.user_id);

                                        return (
                                            <li key={ue.estimation_id + ue.user_id}>
                                                {pastUser?.name ? pastUser.name : `Person who left with a User ID of ${ue.user_id}`}{' '}
                                                estimated {ue.estimate}
                                            </li>
                                        );
                                    })}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Estimations;
