import { useState, useCallback } from 'react';

export interface CopyToClipboardProps {
    textToCopy: string;
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ textToCopy }) => {
    const [showToast, setShowToast] = useState(false);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }, [textToCopy]);

    return (
        <div className="relative">
            <button onClick={handleCopy} className="mx-4 rounded bg-blue-500 px-2 py-1 text-gray-700 focus:outline-none">
                📋
            </button>
            {showToast && <div className="top-100 absolute mt-2 w-32 rounded bg-green-300 py-1 text-center text-white">Copied!</div>}
        </div>
    );
};

export default CopyToClipboard;
