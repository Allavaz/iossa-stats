import Header from "./header";
import Footer from "./footer";
import Navigation from "./navigation";

// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css';
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; /* eslint-disable import/first */

export default function Layout({ children }) {
  return (
    <>
      <Navigation />
      <Header />
      <div className='content'>
        <main>{children}</main>
      </div>
      <Footer />
    </>
  )
}