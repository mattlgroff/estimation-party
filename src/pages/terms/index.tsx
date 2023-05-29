import { useRouter } from 'next/router';
import Head from 'next/head';

const TermsAndConditionsPage = () => {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>Estimation Party - Terms and Conditions</title>
            </Head>
            <main className="flex flex-grow flex-col items-center justify-center px-4 py-2 sm:px-6 lg:px-8">
                <div className="mb-6 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Terms and Conditions</h1>
                </div>
                <div className="prose prose-blue prose-lg mx-auto text-gray-500">
                    <p>
                        Welcome to Estimation Party! These terms and conditions outline the rules and regulations for the use of our
                        website.
                    </p>
                    <h3>License</h3>
                    <p>
                        Estimation Party is open-source software licensed under the
                        <a href="https://github.com/mattlgroff/estimation-party/blob/main/LICENSE.md"> MIT license</a>.
                    </p>
                    <h3>User Names</h3>
                    <p>
                        Users are able to enter names to participate in the Estimation Rooms. These names should not violate any laws,
                        infringe on any rights of third parties, or contain any inappropriate content. Estimation Party reserves the right
                        to remove or change any such names.
                    </p>
                    <h3>Prohibited Use</h3>
                    <p>
                        Any use of Estimation Party that disrupts the normal operation of the site, infringes upon the rights of others, or
                        violates or promotes the violation of any laws is strictly prohibited. We reserve the right to take appropriate
                        action against any user who violates these terms, including banning from future use of the service.
                    </p>
                    <h3>Disclaimer</h3>
                    <p>
                        To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions
                        relating to our website and the use of this website (including, without limitation, any warranties implied by law in
                        respect of satisfactory quality, fitness for purpose and/or the use of reasonable care and skill).
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

export default TermsAndConditionsPage;
