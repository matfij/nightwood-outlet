import Link from "next/link";

const HeaderComponent = ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Sign up", href: "/signup" },
    !currentUser && { label: "Sign in", href: "/signin" },
    currentUser && { label: "Sell items", href: "/items/new" },
    currentUser && { label: "My orders", href: "/orders" },
    currentUser && { label: "Sign out", href: "/signout" },
  ].filter((link) => link);

  return (
    <nav className="navbar navbar-light bg-light p-4">
      <Link href="/" className="navbar-brand">
        Re: Nightwood
      </Link>
      <div className="d-flex justify-contnt-end">
        <ul className="nav d-flex align-items-center">
          {links.map((link, ind) => (
            <li key={ind} className="nav-item">
              <Link href={link.href} className="nav-link">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default HeaderComponent;
