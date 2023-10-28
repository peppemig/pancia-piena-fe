import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-auto">
      <div className="mx-auto w-full max-w-screen-xl p-6 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link to="/">
            <h1 className="mb-2 text-2xl font-bold sm:mb-0">Pancia Piena</h1>
          </Link>
          <ul className="mb-6 flex flex-wrap items-center text-primary opacity-60 sm:mb-0">
            <li>
              <Link to="/" className="mr-4 hover:underline md:mr-6">
                Home
              </Link>
              <Link to="/" className="mr-4 hover:underline md:mr-6">
                Chi siamo
              </Link>
              <Link to="/" className="mr-4 hover:underline md:mr-6">
                Contatti
              </Link>
              <Link to="/" className="mr-4 hover:underline md:mr-6">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-6 text-muted-foreground sm:mx-auto lg:my-8" />
        <span className="block text-sm text-muted-foreground sm:text-center">
          © {new Date().getFullYear()}{" "}
          <a
            target="_blank"
            href="https://github.com/peppemig"
            className="hover:underline"
          >
            Giuseppe Migliozzi
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
