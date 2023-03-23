import buildClient from "../common/api/build-client";

const IndexPage = ({ currentUser }) => {
  return (
    <>
      <h2>Re: Nightwood Outlet</h2>
      <p>{currentUser ? currentUser.email : "Not signed in"} </p>
    </>
  );
};

IndexPage.getInitialProps = async ({ req }) => {
  const client = buildClient({ req });
  const res = await client.get("/api/users/currentUser").catch(() => {});
  return res ? res.data : { currentUser: null };
};

export default IndexPage;
