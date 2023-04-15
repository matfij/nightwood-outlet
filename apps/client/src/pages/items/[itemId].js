import Router from "next/router";
import useRequest from "../../common/hooks/use-request";

const ItemDetailPage = ({ item }) => {
  const [doRequest, errors] = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      itemId: item.id,
    },
    onSuccess: (order) => Router.push(`/orders/${order.id}`),
  });

  return (
    <>
      <h2>{item.name}</h2>
      <h4>Price: {item.price}$</h4>
      <hr></hr>
      <h4>Id: {item.id}</h4>
      <h4>Version: {item.version}</h4>
      <hr></hr>
      <button onClick={() => doRequest()} className="btn btn-primary">
        Make order
      </button>
      {errors}
    </>
  );
};

ItemDetailPage.getInitialProps = async (context, client) => {
  const { itemId } = context.query;
  const { data } = await client.get(`/api/items/readOne/${itemId}`);
  return { item: data };
};

export default ItemDetailPage;
