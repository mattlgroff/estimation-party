const Footer = () => {
    return (
        <footer className="fixed bottom-0 flex w-full flex-col items-center justify-between bg-blue-500 px-4 py-2 text-white sm:flex-row sm:items-start sm:px-6 lg:px-8">
            <div className="mb-2 text-center sm:mb-0 sm:text-left">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()}
                    <a href="https://groff.dev/" target="_blank" rel="noopener noreferrer" className="ml-2 text-white hover:text-blue-200">
                        Matt Groff @ groff.dev
                    </a>
                </p>
                <p className="text-sm">
                    <a
                        href="https://github.com/mattlgroff/estimation-party"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whitespace-nowrap text-white hover:text-blue-200"
                    >
                        GitHub Repo - MIT License
                    </a>
                </p>
            </div>
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:space-x-4 sm:text-left">
                <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:text-blue-200">
                    Privacy Policy
                </a>
                <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:text-blue-200">
                    Terms and Conditions
                </a>
            </div>
        </footer>
    );
};

export default Footer;
