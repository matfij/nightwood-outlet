import buildClient from "../common/api/build-client";
import "bootstrap/dist/css/bootstrap.css";
import HeaderComponent from "../common/components/header";

const AppPage = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <HeaderComponent currentUser={currentUser} />
      <div className="container pt-5 pb-5">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </>
  );
};

AppPage.getInitialProps = async (context) => {
  const client = buildClient(context.ctx);
  const res = await client.get("/api/users/currentUser").catch(() => {});
  const pageProps = context.Component.getInitialProps
    ? await context.Component.getInitialProps(
        context.ctx,
        client,
        res?.data?.currentUser || {}
      )
    : {};
  return {
    pageProps,
    currentUser: res ? res.data.currentUser : null,
  };
};

export default AppPage;
