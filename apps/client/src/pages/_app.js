import buildClient from "../common/api/build-client";
import "bootstrap/dist/css/bootstrap.css";

const AppPage = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <h1>Hello {currentUser.email}</h1>
      <Component {...pageProps} />
    </>
  );
};

AppPage.getInitialProps = async (context) => {
  const client = buildClient(context.ctx);
  const res = await client.get("/api/users/currentUser").catch(() => {});
  const pageProps = context.Component.getInitialProps
    ? await context.Component.getInitialProps(context.ctx)
    : {};
  return {
    pageProps,
    currentUser: res ? res.data.currentUser : null,
  };
};

export default AppPage;
