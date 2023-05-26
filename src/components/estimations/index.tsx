import { useState } from 'react';
import Link from 'next/link';
import { Estimation, UserEstimation, User } from '@deps/types';
import { validEstimates } from '@deps/utils/estimate';

interface EstimationsProps {
    estimationInProgress: boolean;
    estimations: Estimation[];
    userEstimations: UserEstimation[];
    user: User;
    users: User[];
}

const Estimations: React.FC<EstimationsProps> = ({ estimationInProgress, estimations, userEstimations, user, users }) => {
    const [hoveredEstimate, setHoveredEstimate] = useState<null | string>(null);

    const makeEstimate = async (estimate: string) => {
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
                    <p className="mb-4">Choose a Fibonacci number or ? which means: "I'm not sure or I have questions".</p>
                    <div className={`grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-8 xl:grid-cols-11 2xl:grid-cols-12`}>
                        {validEstimates.map((num, index) => (
                            <div
                                key={index}
                                onMouseEnter={() => setHoveredEstimate(num)}
                                onMouseLeave={() => setHoveredEstimate(null)}
                                onClick={() => makeEstimate(num)}
                                className={`flip-container card ${userHasEstimated === num ? 'flipped' : ''} ${
                                    hoveredEstimate === num ? 'flipped' : ''
                                }`}
                            >
                                <div className="flipper">
                                    <div className={`front ${userHasEstimated === num ? 'selected' : ''}`}>
                                        <p className="font-bold">{num}</p>
                                    </div>
                                    <div className={`back flex-col ${userHasEstimated === num ? 'selected' : ''}`}>
                                        <p className="font-bold">{num}</p>
                                        <p className="text-xl">🎉</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {userHasEstimated && (
                        <p className="mt-4">
                            You have estimated: <span className="font-bold">{userHasEstimated}</span>
                        </p>
                    )}
                </div>
            )}

            <div className="my-4 h-full rounded-md border border-gray-300 p-4">
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
