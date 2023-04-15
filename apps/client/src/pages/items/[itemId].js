const ItemDetailPage = ({ item }) => {
  return (
    <>
      <h2>{item.name}</h2>
      <h4>Price: {item.price}$</h4>
      <hr></hr>
      <h4>Id: {item.id}</h4>
      <h4>Version: {item.version}</h4>
    </>
  );
};

ItemDetailPage.getInitialProps = async (context, client) => {
  const { itemId } = context.query;
  const { data } = await client.get(`/api/items/readOne/${itemId}`);
  return { item: data };
};

export default ItemDetailPage;
