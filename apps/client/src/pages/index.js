import buildClient from "../common/api/build-client";

const Index = ({ currentUser }) => {
  console.log(currentUser);
  return (
    <>
      <h2>Re: Nightwood Outlet</h2>
    </>
  );
};

Index.getInitialProps = async ({ req }) => {
  const client = buildClient({ req });
  const { data } = await client.get("/api/users/currentUser");
  return data;
};

export default Index;
