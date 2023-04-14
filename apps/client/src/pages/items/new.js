import { useState } from "react";
import Router from "next/router";
import useRequest from "../../common/hooks/use-request";

const NewItemPage = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [doRequest, errors] = useRequest({
    url: "/api/items/create",
    method: "post",
    body: {
      name,
      price,
    },
    onSuccess: () => Router.push("/items/list"),
  });

  const formatPrice = () => {
    const priceVal = parseFloat(price);
    if (isNaN(priceVal)) {
      return;
    }
    setPrice(priceVal.toFixed(2));
  };

  const createItem = async (event) => {
    event.preventDefault();
    await doRequest();
  };

  return (
    <>
      <h2>Add new item</h2>
      <form onSubmit={createItem}>
        <div className="form-group">
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            value={price}
            onBlur={formatPrice}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </>
  );
};

export default NewItemPage;
