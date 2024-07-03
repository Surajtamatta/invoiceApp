

import React, { useState, useEffect } from "react";
import { useMessage } from "@/components/Message";
import Link from "next/link";
import { useRouter } from "next/router";
import { MongoClient, ObjectId } from "mongodb";

const AddNew = ({ data }) => {
  const messageApi = useMessage();
  const router = useRouter();

  const [items, setItems] = useState(data?.items);
  const [sellerName, setsellerName] = useState(data?.sellerDetails?.name || "");
  const [sellerPan, setsellerPan] = useState(data?.sellerDetails?.pan || "");
  const [sellerGST, setsellerGST] = useState(data?.sellerDetails?.gst || "");
  const [sellerAddress, setsellerAddress] = useState(data?.sellerDetails?.address || "");
  const [sellerCity, setsellerCity] = useState(data?.sellerDetails?.city || "");
  const [sellerPostalCode, setsellerPostalCode] = useState(data?.sellerDetails?.postalCode || "");
  const [sellerCountry, setsellerCountry] = useState(data?.sellerDetails?.country || "");
  const [billingName, setbillingName] = useState(data?.billingDetails?.name || "");
  const [billingAddress, setbillingAddress] = useState(data?.billingDetails?.address || "");
  const [billingCity, setbillingCity] = useState(data?.billingDetails?.city || "");
  const [billingPostalCode, setbillingPostalCode] = useState(data?.billingDetails?.postalCode || "");
  const [billingCountry, setbillingCountry] = useState(data?.billingDetails?.country || "");
  const [shippingName, setshippingName] = useState(data?.shippingDetails?.name || "");
  const [shippingAddress, setshippingAddress] = useState(data?.shippingDetails?.address || "");
  const [shippingCity, setshippingCity] = useState(data?.shippingDetails?.city || "");
  const [shippingPostalCode, setshippingPostalCode] = useState(data?.shippingDetails?.postalCode || "");
  const [shippingCountry, setshippingCountry] = useState(data?.shippingDetails?.country || "");
  const [invoiceDate, setinvoiceDate] = useState(data?.invoiceDetails?.invoiceDate || "");
  const [placeOfSupply, setplaceOfSupply] = useState(data?.invoiceDetails?.placeOfSupply || "");
  const [orderNo, setorderNo] = useState(data?.invoiceDetails?.orderNo || "");
  const [orderDate, setorderDate] = useState(data?.invoiceDetails?.orderDate || "");


  const addItem = () => {
    setItems([...items, { itemname: "", itemquantity: 0, itemprice: 0,itemdiscount: 0, taxType: 0, taxRate: 0,  total: 0 }]);
    };

  const handlerChange = (event, i) => {
    const { name, value } = event.target;
    const list = [...items];
    list[i][name] = value;
    const netAmount = list[i].itemquantity * list[i].itemprice - list[i].itemdiscount;
    const taxAmount = netAmount * (list[i].taxRate / 100);
    const totalAmount = netAmount + taxAmount;
    list[i]["total"] = totalAmount;
    setItems(list);
  };

  const deleteItem = (i) => {
    const updatedItems = [...items];
    updatedItems.splice(i, 1);
    setItems(updatedItems);
  };

  const totalAmount = items?.reduce((acc, curr) => acc + curr.total, 0);

  const createInvoice = async (invoiceId,status) => {
    try {
      const payload = {
        sellerDetails: {
          name: sellerName,
          pan: sellerPan,
          gst: sellerGST,
          address: sellerAddress,
          city: sellerCity,
          postalCode: sellerPostalCode,
          country: sellerCountry,
        },
        billingDetails: {
          name: billingName,
          address: billingAddress,
          city: billingCity,
          postalCode: billingPostalCode,
          country: billingCountry,
        },
        shippingDetails: {
          name: shippingName,
          address: shippingAddress,
          city: shippingCity,
          postalCode: shippingPostalCode,
          country: shippingCountry,
        },
        invoiceDetails: {
          invoiceDate: invoiceDate,
          placeOfSupply: placeOfSupply,
          orderNo: orderNo,
          orderDate: orderDate,
        },
        status: status,
        items: items,
        totalAmount: totalAmount,

      };
      const res = await fetch(`/api/edit/${invoiceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (messageApi) {
        messageApi.success(data?.message);
        router.push(`/invoices/${invoiceId}`);
      } else {
        console.error('messageApi is not defined');
      }
    } catch (error) {
      if (messageApi) {
        messageApi.error(error.message);
      } else {
        console.error('messageApi is not defined');
      }
    }
  };

  return (
    <div className="main__container">
      <div className="new__invoice">
        <div className="new__invoice-header">
          <h2>Edit Invoice</h2>
        </div>
        <div className="new__invoice-body">
          <div className="bill__from">
            <h3 className="bill__title">Seller Details:</h3>
            <div className="form__group inline__form-group">
              <div>
                <p>Name:</p>
                <input
                  type="text"
                  value={sellerName}
                  onChange={(e) => setsellerName(e.target.value)}
                />
              </div>
              <div>
                <p>PAN No.:</p>
                <input
                  type="text"
                  value={sellerPan}
                  onChange={(e) => setsellerPan(e.target.value)}
                />
              </div>
              <div>
                <p>GST Registration No.:</p>
                <input
                  type="text"
                  value={sellerGST}
                  onChange={(e) => setsellerGST(e.target.value)}
                />
              </div>
              <div>
                <p>Address:</p>
                <input
                  type="text"
                  value={sellerAddress}
                  onChange={(e) => setsellerAddress(e.target.value)}
                />
              </div>
              <div>
                <p>City:</p>
                <input
                  type="text"
                  value={sellerCity}
                  onChange={(e) => setsellerCity(e.target.value)}
                />
              </div>
              <div>
                <p>Postal Code:</p>
                <input
                  type="text"
                  value={sellerPostalCode}
                  onChange={(e) => setsellerPostalCode(e.target.value)}
                />
              </div>
              <div>
                <p>Country:</p>
                <input
                  type="text"
                  value={sellerCountry}
                  onChange={(e) => setsellerCountry(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bill__to">
            <h3 className="bill__title">Billing Details:</h3>
            <div className="form__group inline__form-group">
              <div>
                <p>Client Name:</p>
                <input
                  type="text"
                  value={billingName}
                  onChange={(e) => setbillingName(e.target.value)}
                />
              </div>
              <div>
                <p>Address:</p>
                <input
                  type="text"
                  value={billingAddress}
                  onChange={(e) => setbillingAddress(e.target.value)}
                />
              </div>
              <div>
                <p>City:</p>
                <input
                  type="text"
                  value={billingCity}
                  onChange={(e) => setbillingCity(e.target.value)}
                />
              </div>
              <div>
                <p>Postal Code:</p>
                <input
                  type="text"
                  value={billingPostalCode}
                  onChange={(e) => setbillingPostalCode(e.target.value)}
                />
              </div>
              <div>
                <p>Country:</p>
                <input
                  type="text"
                  value={billingCountry}
                  onChange={(e) => setbillingCountry(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bill__to">
            <h3 className="bill__title">Shipping Details:</h3>
            <div className="form__group inline__form-group">
              <div>
                <p>Client Name:</p>
                <input
                  type="text"
                  value={shippingName}
                  onChange={(e) => setshippingName(e.target.value)}
                />
              </div>
              <div>
                <p>Address:</p>
                <input
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setshippingAddress(e.target.value)}
                />
              </div>
              <div>
                <p>City:</p>
                <input
                  type="text"
                  value={shippingCity}
                  onChange={(e) => setshippingCity(e.target.value)}
                />
              </div>
              <div>
                <p>Postal Code:</p>
                <input
                  type="text"
                  value={shippingPostalCode}
                  onChange={(e) => setshippingPostalCode(e.target.value)}
                />
              </div>
              <div>
                <p>Country:</p>
                <input
                  type="text"
                  value={shippingCountry}
                  onChange={(e) => setshippingCountry(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bill__from">
            <h3 className="bill__title">Invoice Details:</h3>
            <div className="form__group inline__form-group">
              <div>
                <p>Invoice Date:</p>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setinvoiceDate(e.target.value)}
                />
              </div>
              <div>
                <p>Place Of Supply:</p>
                <input
                  type="text"
                  value={placeOfSupply}
                  onChange={(e) => setplaceOfSupply(e.target.value)}
                />
              </div>
              <div>
                <p>Order No.:</p>
                <input
                  type="text"
                  value={orderNo}
                  onChange={(e) => setorderNo(e.target.value)}
                />
              </div>
              <div>
                <p>Order Date:</p>
                <input
                  type="date"
                  value={orderDate}
                  onChange={(e) => setorderDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bill__from">
            <h3 className="bill__title">Items:</h3>
            <div className="form__group">
              {items.map((item, i) => (
                <div key={i} className="item__card">
                  <div className="form__group inline__form-group">
                    <div>
                      <p>Item Name:</p>
                      <input
                        type="text"
                        name="itemname"
                        value={item.itemname}
                        onChange={(e) => handlerChange(e, i)}
                      />
                    </div>
                    <div>
                      <p>Quantity:</p>
                      <input
                        type="number"
                        name="itemquantity"
                        value={item.itemquantity}
                        onChange={(e) => handlerChange(e, i)}
                      />
                    </div>
                    <div>
                      <p>Price:</p>
                      <input
                        type="number"
                        name="itemprice"
                        value={item.itemprice}
                        onChange={(e) => handlerChange(e, i)}
                      />
                    </div>
                    <div>
                      <p>Discount:</p>
                      <input
                        type="number"
                        name="itemdiscount"
                        value={item.itemdiscount}
                        onChange={(e) => handlerChange(e, i)}
                      />
                    </div>
                    <div>
                      <p>Tax Type:</p>
                      <input 
                      type="text" 
                      name="taxType"
                      value={item.taxType}
                      onChange={(e) => handlerChange(e, i)}
                      />

                    </div>
                    <div>
                      <p>Tax Rate:</p>
                      <input 
                      type="number"
                      name="taxRate"
                      value={item.taxRate}
                      onChange={(e) => handlerChange(e, i)} 
                      />
                   </div>
                    <div>
                      <p>Total:</p>
                      <h4>{item.total}</h4>
                    </div>
                    <button className="edit__btn" onClick={() => deleteItem(i)}>
                    Delete
                  </button>
                  </div>
                </div>
              ))}

            </div>
          </div>

          <div className="total__amount">
            <h3>Total Amount: {totalAmount}</h3>
          </div>
        </div>



        <div className="new__invoice__btns">
            <button className="add__item-btn" onClick={addItem}>
              Add New Item
            </button>
            <div className="btn_wrapper">
              <Link href="/">
                <button className="edit__btn">Discard</button>
              </Link>
              <button className="draft__btn" onClick={() => createInvoice(data.id,"draft")}>
                Save as Draft
              </button>
              <button className="mark__as-btn" onClick={() => createInvoice(data.id,"pending")}>
                Send & Save
              </button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default AddNew;








export async function getStaticPaths() {
  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.USER__NAME}:${process.env.USER__PASSWORD}@cluster0.liesnjz.mongodb.net/${process.env.DATABASE__NAME}?retryWrites=true&w=majority&appName=Cluster0`
  );

  try {
    const db = client.db();
    const collection = db.collection("allInvoices");
    const invoices = await collection.find({}, { projection: { _id: 1 } }).toArray();

    return {
      paths: invoices.map((invoice) => ({
        params: { invoiceId: invoice._id.toString() },
      })),
      fallback: 'blocking',
    };
  } catch (error) {
    console.error("Error fetching invoices for getStaticPaths:", error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  } finally {
    await client.close();
  }
}

export async function getStaticProps(context) {
  const { params } = context;
  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.USER__NAME}:${process.env.USER__PASSWORD}@cluster0.liesnjz.mongodb.net/${process.env.DATABASE__NAME}?retryWrites=true&w=majority&appName=Cluster0`
  );

  try {
    const db = client.db();
    const collection = db.collection("allInvoices");
    const invoice = await collection.findOne({ _id: new ObjectId(params.invoiceId) });

    if (!invoice) {
      return {
        notFound: true,
      };
    }

    // Ensure all fields are defined or set to null
    const sanitizedInvoice = {
      id: invoice._id.toString(),
      sellerDetails: invoice.sellerDetails || null,
      billingDetails: invoice.billingDetails || null,
      shippingDetails: invoice.shippingDetails || null,
      invoiceDetails: invoice.invoiceDetails || null,
      paymentDetails: invoice.paymentDetails || null,
      items: invoice.items || null,
      status: invoice.status || null,
      totalAmount: invoice.totalAmount || null,
      taxType: invoice.taxType || null,
      taxRate: invoice.taxRate || null,
    };

    return {
      props: {
        data: sanitizedInvoice,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return {
      props: {
        data: null,
      },
    };
  } finally {
    await client.close();
  }
}
