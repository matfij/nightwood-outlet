const OrdersPage = ({ orders }) => {
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "UTC",
    }).format(new Date(date));
  };

  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id} className="card">
          <div className="card-body">
            <div className="card-title">{order.item.name}</div>
            <div className="card-subtitle text-muted">
              Price: {order.item.price}$
            </div>
            <div className="card-subtitle text-muted">
              Status: {order.status}
            </div>
            <div className="card-text">Data: {formatDate(order.expiresAt)}</div>
          </div>
        </li>
      ))}
    </ul>
  );
};

OrdersPage.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");
  return { orders: data };
};

export default OrdersPage;
