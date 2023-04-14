const IndexPage = ({ currentUser }) => {
  return (
    <>
      <h2>Re: Nightwood Outlet</h2>
      <p>{currentUser ? currentUser.email : "Not signed in"} </p>
    </>
  );
};

export default IndexPage;
