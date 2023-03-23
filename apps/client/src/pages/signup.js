export default () => {
  return (
    <>
      <h2>Signup</h2>
      <form>
        <div className="form-group">
          <label>Email</label>
          <input className="form-control" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" className="form-control" />
        </div>
        <button className="btn btn-primary">Confirm</button>
      </form>
    </>
  );
};
