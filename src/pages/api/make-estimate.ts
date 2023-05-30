import type { NextApiRequest, NextApiResponse } from 'next';
import { makeUserEstimate } from '@deps/services/estimation';
import { validEstimates } from '@deps/utils/estimate';
import * as Sentry from '@sentry/nextjs';

interface MakeEstimateResponse {
    success?: boolean;
    error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<MakeEstimateResponse>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    const { user_id, estimation_id, estimate } = req.body;

    // Check if estimate is valid (Fibonacci number or ?)
    if (!estimate || !validEstimates.includes(estimate)) {
        return res.status(400).json({ error: 'Invalid estimate, please use a Fibonacci number or a ?.' });
    }

    try {
        await makeUserEstimate(user_id, estimation_id, estimate);

        return res.status(200).json({ success: true });
    } catch (error) {
        Sentry.captureException(error);
        console.error(error);
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An error occurred when making the estimate.' });
    }
}
