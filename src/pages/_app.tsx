import '@deps/styles/globals.css';
import type { AppProps } from 'next/app';
import PageLayout from '@deps/components/page-layout';

function App({ Component, pageProps }: AppProps) {
    return (
        <PageLayout>
            <Component {...pageProps} />
        </PageLayout>
    );
}

export default App;
