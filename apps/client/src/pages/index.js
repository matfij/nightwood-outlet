import Link from "next/link";

const IndexPage = ({ currentUser, items }) => {
  const itemList = items.map((item) => {
    return (
      <tr key={item.id}>
        <td>{item.name}</td>
        <td>{item.price}</td>
        <td>
          <Link href={`/items/${item.id}`}>
            ℹ️
          </Link>
        </td>
      </tr>
    );
  });
  return (
    <>
      <div>
        <h2>Items</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{itemList}</tbody>
        </table>
      </div>
    </>
  );
};

IndexPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/items/readAll");
  return { items: data };
};

export default IndexPage;
