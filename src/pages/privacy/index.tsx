import { useRouter } from 'next/router';
import Head from 'next/head';

const PrivacyPolicyPage = () => {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>Estimation Party - Privacy Policy</title>
            </Head>
            <main className="flex flex-grow flex-col items-center justify-center px-4 py-2 sm:px-6 lg:px-8">
                <div className="mb-6 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Privacy Policy</h1>
                </div>
                <div className="prose prose-blue prose-lg mx-auto text-gray-500">
                    <p>
                        At Estimation Party, we respect your privacy and commit to protecting it. This Privacy Policy outlines our practices
                        for data collection, use, and disclosure.
                    </p>
                    <h3>Data We Collect and How We Use It</h3>
                    <p>
                        We only collect data necessary for the function of Estimation Rooms, which are automatically deleted after 24 hours.
                        We also use Sentry.io for analytics purposes, but this information is not used for anything beyond improving our
                        service.
                    </p>
                    <h3>Data Sharing and Disclosure</h3>
                    <p>
                        We do not share or sell your data with anyone. Your data stays with us and is used solely for the purpose of running
                        the Estimation Rooms feature and improving our service through analytics. The analytics data collected by Sentry.io
                        is not shared with any third parties.
                    </p>
                    <h3>Data Deletion Requests</h3>
                    <p>
                        For any data deletion requests, you may contact us at <a href="mailto:mattlgroff@gmail.com">mattlgroff@gmail.com</a>
                        . We commit to processing your request in a timely manner.
                    </p>
                </div>
                <button
                    onClick={() => router.push('/')}
                    className="mt-6 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                >
                    Back to Home
                </button>
            </main>
        </>
    );
};

export default PrivacyPolicyPage;
