const Footer = () => {
  return (
    <footer className="mt-auto">
      <div className="mx-auto w-full max-w-screen-xl p-6 md:py-8">
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
