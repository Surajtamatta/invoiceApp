import React, { useState, useRef } from "react";
import { useMessage } from "@/components/Message";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaArrowLeftLong } from "react-icons/fa6";
const AddNew = () => {
  const messageApi = useMessage();
  const router = useRouter();
  const [items, setItems] = useState([]);

  // Refs for Seller Details
  const sellerName = useRef("");
  const sellerPan = useRef("");
  const sellerGST = useRef("");
  const sellerAddress = useRef("");
  const sellerCity = useRef("");
  const sellerPostalCode = useRef("");
  const sellerCountry = useRef("");

  // Refs for Billing Details
  const billingName = useRef("");
  const billingAddress = useRef("");
  const billingCity = useRef("");
  const billingPostalCode = useRef("");
  const billingCountry = useRef("");

  // Refs for Shipping Details
  const shippingName = useRef("");
  const shippingAddress = useRef("");
  const shippingCity = useRef("");
  const shippingPostalCode = useRef("");
  const shippingCountry = useRef("");

  // Refs for Invoice Details
  const invoiceDate = useRef("");
  const placeOfSupply = useRef("");
  const orderNo = useRef("");
  const orderDate = useRef("");



  const addItem = () => {
    setItems([...items, { itemname: "", itemquantity: 0, itemprice: 0,itemdiscount: 0, taxType: 0,taxRate: 0,  total: 0 }]);
  };


  const handlerChange = (event, i) => {
    const { name, value } = event.target;
    const list = [...items];
    list[i][name] = value;
    const netAmount = (list[i]["itemquantity"] * list[i]["itemprice"]) - list[i]["itemdiscount"];
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


  const createInvoice = async (status) => {
    try {
      // Check for empty fields
      const requiredFields = [
        sellerName.current?.value,
        sellerPan.current?.value,
        sellerGST.current?.value,
        sellerAddress.current?.value,
        sellerCity.current?.value,
        sellerPostalCode.current?.value,
        sellerCountry.current?.value,
        billingName.current?.value,
        billingAddress.current?.value,
        billingCity.current?.value,
        billingPostalCode.current?.value,
        billingCountry.current?.value,
        shippingName.current?.value,
        shippingAddress.current?.value,
        shippingCity.current?.value,
        shippingPostalCode.current?.value,
        shippingCountry.current?.value,
        invoiceDate.current?.value,
        placeOfSupply.current?.value,
        orderNo.current?.value,
        orderDate.current?.value,
      ];
  
      if (requiredFields.some(field => !field)) {
        // If any required field is empty, show warning
        messageApi.warning("All fields are required. Please provide valid data.");
      } else {
        // All fields are filled, proceed to create invoice
        const payload = {
          sellerDetails: {
            name: sellerName.current.value,
            pan: sellerPan.current.value,
            gst: sellerGST.current.value,
            address: sellerAddress.current.value,
            city: sellerCity.current.value,
            postalCode: sellerPostalCode.current.value,
            country: sellerCountry.current.value,
          },
          billingDetails: {
            name: billingName.current.value,
            address: billingAddress.current.value,
            city: billingCity.current.value,
            postalCode: billingPostalCode.current.value,
            country: billingCountry.current.value,
          },
          shippingDetails: {
            name: shippingName.current.value,
            address: shippingAddress.current.value,
            city: shippingCity.current.value,
            postalCode: shippingPostalCode.current.value,
            country: shippingCountry.current.value,
          },
          invoiceDetails: {
            invoiceDate: invoiceDate.current.value,
            placeOfSupply: placeOfSupply.current.value,
            orderNo: orderNo.current.value,
            orderDate: orderDate.current.value,
          },
          status: status,
          items: items,
          totalAmount: totalAmount,
        };
  
        const res = await fetch("/api/add-new", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
  
        const data = await res.json();
        messageApi.success(data?.message);
        router.push(`/invoices/${data._id}`);
      }
    } catch (error) {
      messageApi.error(error);
      console.error("Error creating invoice:", error);
    }
  };
  
  

  return (
    <div className="main__container">

      <div className="new__invoice">
      <div className="details_boxwrapper">
        <Link  href={'/'} className="back__btn">
          <FaArrowLeftLong /> 
        </Link >
      </div>
        <div className="new__invoice-header">
          <h2>New Invoice</h2>
        </div>

        {/* ======== new invoice body ========= */}
        <div className="new__invoice-body">
        
          {/* ======= bill from (Seller Details) ========== */}
          <div className="bill__from">
            <h3 className="bill__title">Seller Details:</h3>
            <div className="form__group inline__form-group">
              <div>
                <p>Name:</p>
                <input type="text" ref={sellerName} />
              </div>
              <div>
                <p>PAN No.:</p>
                <input type="text" ref={sellerPan} />
              </div>
              <div>
                <p>GST Registration No.:</p>
                <input type="text" ref={sellerGST} />
              </div>
              <div>
                <p>Address:</p>
                <input type="text" ref={sellerAddress} />
              </div>
              <div>
                <p>City:</p>
                <input type="text" ref={sellerCity} />
              </div>
              <div>
                <p>Postal Code:</p>
                <input type="text" ref={sellerPostalCode} />
              </div>
              <div>
                <p>Country:</p>
                <input type="text" ref={sellerCountry} />
              </div>
            </div>
          </div>

          {/* ======= bill to (Billing Details) ========== */}
          <div className="bill__to">
            <h3 className="bill__title">Billing Details:</h3>
            <div className="form__group inline__form-group">
              <div>
                <p>Name:</p>
                <input type="text" ref={billingName} />
              </div>
              <div>
                <p>Address:</p>
                <input type="text" ref={billingAddress} />
              </div>
              <div>
                <p>City:</p>
                <input type="text" ref={billingCity} />
              </div>
              <div>
                <p>Postal Code:</p>
                <input type="text" ref={billingPostalCode} />
              </div>
              <div>
                <p>Country:</p>
                <input type="text" ref={billingCountry} />
              </div>
            </div>
          </div>

          {/* ======= shipping details ========== */}
          <div className="bill__to">
            <h3 className="bill__title">Shipping Details:</h3>
            <div className="form__group inline__form-group">
              <div>
                <p>Name:</p>
                <input type="text" ref={shippingName} />
              </div>
              <div>
                <p>Address:</p>
                <input type="text" ref={shippingAddress} />
              </div>
              <div>
                <p>City:</p>
                <input type="text" ref={shippingCity} />
              </div>
              <div>
                <p>Postal Code:</p>
                <input type="text" ref={shippingPostalCode} />
              </div>
              <div>
                <p>Country:</p>
                <input type="text" ref={shippingCountry} />
              </div>
            </div>
          </div>

          {/* ======= invoice details ========== */}
          <div className="bill__to">
            <h3 className="bill__title">Invoice Details:</h3>
            <div className="form__group inline__form-group">
              <div>
                <p>Invoice Date:</p>
                <input type="date" ref={invoiceDate} />
              </div>
              <div>
                <p>Place of Supply:</p>
                <input type="text" ref={placeOfSupply} />
              </div>
              <div>
                <p>Order No.:</p>
                <input type="text" ref={orderNo} />
              </div>
              <div>
                <p>Order Date:</p>
                <input type="date" ref={orderDate} />
              </div>
              
              
        
            </div>
          </div>

          {/* ======= invoice product items ========== */}
          <div className="invoice__items">
            {items.length !== 0 && <h3>Item List</h3>}
            {items.map((item, i) => (
              <div className="item" key={i}>
                <div className="form__group inline__form-group">
                  <div>
                    <p>Item Name:</p>
                    <input
                      type="text"
                      name="itemname"
                      onChange={(e) => handlerChange(e, i)}
                    />
                  </div>
                  <div>
                    <p>Qty:</p>
                    <input
                      type="number"
                      name="itemquantity"
                      onChange={(e) => handlerChange(e, i)}
                    />
                  </div>
                  <div>
                    <p>Price:</p>
                    <input
                      type="number"
                      name="itemprice"
                      onChange={(e) => handlerChange(e, i)}
                    />
                  </div>
                  <div>
                    <p>Discount:</p>
                    <input
                      type="number"
                      name="itemdiscount"
                      onChange={(e) => handlerChange(e, i)}
                    />

                  </div>
                    <div>
                      <p>Tax Type:</p>
                      <input 
                      type="text" 
                      name="taxType"
                      onChange={(e) => handlerChange(e, i)}
                      />

                    </div>
                    <div>
                      <p>Tax Rate:</p>
                      <input 
                      type="number"
                      name="taxRate"
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

          {/* ======= buttons ========== */}
          <div className="new__invoice__btns">
            <button className="add__item-btn" onClick={addItem}>
              Add New Item
            </button>
            <div className="btn_wrapper">
              <Link href="/">
                <button className="edit__btn">Discard</button>
              </Link>
              <button className="draft__btn" onClick={() => createInvoice("draft")}>
                Save as Draft
              </button>
              <button className="mark__as-btn" onClick={() => createInvoice("pending")}>
                Send & Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNew;

