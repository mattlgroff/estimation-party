import { Estimation, User, UserEstimation } from '@deps/types';
import clsx from 'clsx';

interface UserListProps {
    estimationInProgress: boolean;
    leadName: string;
    name: string;
    userEstimations: UserEstimation[];
    users: User[];
    estimations: Estimation[];
}

const UserList: React.FC<UserListProps> = ({ estimationInProgress, leadName, name, userEstimations, users, estimations }) => {
    return (
        <div>
            <h2 className="mb-4 text-2xl font-bold">Party Members 🥳</h2>
            <ul className="space-y-2">
                {users.map(user => {
                    const userHasEstimated = userEstimations.find(
                        userEstimation => userEstimation.user_id === user.id && userEstimation.estimation_id === estimations[0].id
                    )?.estimate;

                    const classes = clsx('flex items-center justify-between p-2', {
                        'font-bold text-blue-600': userHasEstimated,
                    });

                    const isYou = name === user.name;

                    return (
                        <li key={user.id} className={classes}>
                            <span>{user.name}</span>
                            {leadName === user.name && <span>(Lead)</span>}
                            {isYou && <span>(You)</span>}
                            {estimationInProgress && <span>{userHasEstimated ? 'Estimated ✅' : 'Waiting'}</span>}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default UserList;
