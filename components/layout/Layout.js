// components/Layout.js

import Header from './Header';
import Footer from './Footer';
import OrganizationSchema from '../seo/OrganizationSchema';

export default function Layout({ children }) {
    return (
        <div className="page-shell">
            <OrganizationSchema />
            <Header />
            <main className="page-main">{children}</main>
            <Footer />
            <style jsx>{`
                .page-shell {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    background-color: #f4f7fb;
                }
                .page-main {
                    flex: 1;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                }
            `}</style>
        </div>
    );
}