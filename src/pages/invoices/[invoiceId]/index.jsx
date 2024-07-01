import React, { useRef } from "react";
import { useRouter } from "next/router";
import { MongoClient, ObjectId } from "mongodb";
import Image from "next/image";
import dynamic from 'next/dynamic';
import { useMessage } from "@/components/Message";
import { FaArrowLeftLong } from "react-icons/fa6";
import Link from "next/link";
import { ToWords } from 'to-words';
import DownloadDetails from "@/pages/download";
import DownloadButton from "@/components/DownloadButton";
const Table = dynamic(() => import('antd/es/table'), { ssr: false });


const InvoiceDetails = ({data}) => {
  const messageApi = useMessage();
  const router = useRouter();
  const modalRef = useRef(null);
  const invoiceRef = useRef();
  const toWords = new ToWords({
    localeCode: 'en-IN',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
      currencyOptions: {
        // can be used to override defaults for the selected locale
        name: 'Rupee',
        plural: 'Rupees',
        symbol: '₹',
        fractionalUnit: {
          name: 'Paisa',
          plural: 'Paise',
          symbol: '',
        },
      },
    },
  });


  const updateStatus = async (invoiceId) => {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: "PUT",
      });
      const data = await res.json();
      if (messageApi) {

        messageApi.success(data?.message);
        console.log(data)
      } else {
        console.error('messageApi is not defined');
      }
      router.push("/");
    } catch (error) {
      if (messageApi) {
        messageApi.error(error);
      } else {
        console.error('messageApi is not defined');
      }
    }
  };

  const deleteInvoice = async (invoiceId) => {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (messageApi) {

        messageApi.success(data?.message);
        router.push("/");
      } else {
        console.error('messageApi is not defined');
      }
      
    } catch (error) {
      if (messageApi) {
        messageApi.error(error);
      } else {
        console.error('messageApi is not defined');
      }
    }
  };

  // open modal
  const modalToggle = () => modalRef.current.classList.toggle("showModal");




const invoicedetail = {
    dataSource: [
      {
        placesupply: data?.invoiceDetails?.placeOfSupply,
        orderno: data?.invoiceDetails?.orderNo,
        orderdate:data?.invoiceDetails?.orderDate,
        invoiceno:data?.id.substr(0, 6).toUpperCase(),
        invoicedate:data?.invoiceDetails?.invoiceDate,
      },
    ],
  
    columns: [
      {
        title: "Place of Supply",
        dataIndex: "placesupply",
        key: "placesupply",
        with:100,
        fixed: 'left',
      },
      {
        title: "Order No.",
        dataIndex: "orderno",
        key: "orderno",
        with:100,
        fixed: 'left',
      },
      {
        title: "Order Date",
        dataIndex: "orderdate",
        key: "orderdate",
      },
      {
        title: "Invoice No.",
        dataIndex: "invoiceno",
        key: "invoiceno",
      },
      {
        title: "Invoice Date",
        dataIndex: "invoicedate",
        key: "invoicedate",
        with:100,
        fixed: 'right',
      },
    ],
  };

  const productdetail = {
    dataSource:  (data?.items || []).map((item) => ({
      description: item?.itemname,
      unitprice: item?.itemprice,
      quantity: item?.itemquantity,
      discount: item?.itemdiscount,
      netamount: (item?.itemprice * item?.itemquantity) - ((item?.itemprice * item?.itemquantity) * (item?.itemdiscount / 100)).toFixed(2),
      taxRate: item?.taxRate,
      taxType: item?.taxType,
      taxamount: ((item?.itemprice * item?.itemquantity) * (item?.taxRate / 100)).toFixed(2),
      totalamount: ((item?.itemprice * item?.itemquantity) + ((item?.itemprice * item?.itemquantity) * (item?.taxRate / 100)) - ((item?.itemprice * item?.itemquantity) * (item?.itemdiscount / 100))).toFixed(2),
    })),
    columns: [
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        with:100,
        fixed: 'left',
      },
      {
        title: "Unit Price",
        dataIndex: "unitprice",
        key: "unitprice",
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
      },
      {
        title: "Discount",
        dataIndex: "discount",
        key: "discount",
      },
      {
        title: "Net Amount",
        dataIndex: "netamount",
        key: "netamount",
      },
      {
        title: "Tax Rate",
        dataIndex: "taxRate",
        key: "taxRate",
      },
      {
        title: "Tax Type",
        dataIndex: "taxType",
        key: "taxType",
      },
      {
        title: "Tax Amount",
        dataIndex: "taxamount",
        key: "taxamount",
      },
      {
        title: "Total Amount",
        dataIndex: "totalamount",
        key: "totalamount",
        with:100,
        fixed: 'right',
      },
    ],
  };
  // Calculate total values
const total = data?.items?.reduce((accumulator, item) => {
  const totalNet = item.itemprice * item.itemquantity - (item.itemprice * item.itemquantity * (item.itemdiscount / 100));
  const totalTax = item.itemprice * item.itemquantity * (item.taxRate / 100);
  const grandTotal = item.itemprice * item.itemquantity + totalTax - totalNet;

  accumulator.totalnet += totalNet;
  accumulator.totaltax += totalTax;
  accumulator.grandtotal += grandTotal;

  return accumulator;
}, {
  totalnet: 0,
  totaltax: 0,
  grandtotal: 0,
});

// Create dataSource with a single entry
const amountdetail = {
  dataSource: [{
    totalnet: total?.totalnet.toFixed(2),
    totaltax: total?.totaltax.toFixed(2),
    grandtotal: total?.grandtotal.toFixed(2),
    amountword: toWords.convert(total?.grandtotal.toFixed(2)), // Placeholder for amount in words, adjust as needed
  }],
  columns: [
    {
      title: "Total Net Amount",
      dataIndex: "totalnet",
      key: "totalnet",
      width: 100,
      fixed: 'left',
    },
    {
      title: "Total Tax Amount",
      dataIndex: "totaltax",
      key: "totaltax",
    },
    {
      title: "Grand Total",
      dataIndex: "grandtotal",
      key: "grandtotal",
    },
    {
      title: "Amount in Words",
      dataIndex: "amountword",
      key: "amountword",
      fixed: 'right',
    },
  ],
};

  return (


        <div className="main__container">
      <div className="details_boxwrapper">
        <Link  href={'/'} className="back__btn">
          <FaArrowLeftLong /> 
        </Link >
        <div className="invoice_btn_wrapper">
            
            <DownloadButton  targetRef={invoiceRef} />
          </div>
      </div>
      <div style={{ display: 'none' }}>
      <DownloadDetails ref={invoiceRef} data={data}/>       
        </div>   
      {/* ======= invoice details header ========== */}
      <div className="invoice__details-header">
        <div className="details__status">
        <button
            className={`${
              data?.status === "paid"
                ? "paid__status"
                : data?.status === "pending"
                ? "pending__status"
                : "draft__status"
            }`}
          >
            {data?.status}
          </button>
        </div>

        <div className="details__btns">
          <button
            className="edit__btn"
            onClick={() => router.push(`/edit/${data?.id}`)}
          >
            Edit
          </button>

          {/* ========= confirm deletion modal start ========== */}
          <div className="delete__modal" ref={modalRef}>
            <div className="modal">
              <h3>Confirm Deletion</h3>
              <p>
                Are you sure you want to delete invoice #
                {data?.id?.substr(0, 6).toUpperCase()}? This action cannon be
                undone.
              </p>

              <div className="details__btns modal__btns">
                <button className="edit__btn" onClick={modalToggle}>
                  Cancel
                </button>

                <button
                  className="delete__btn"
                  onClick={() => deleteInvoice(data?.id)}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>

          {/* ======== confirm deletion modal end */}

          <button className="delete__btn" onClick={modalToggle}>
            Delete
          </button>

          <button
            onClick={() => updateStatus(data?.id)}
            className={`${
              data?.status === "paid" || data?.status === "draft" ? "disable" : ""
            } mark__as-btn `}
            >
            Mark as Paid
          </button>
        </div>
      </div>



      {/* ========= invoice details =========== */}

      <div className="invoice__details">
        <div className="details__box">
        <h4>{data?.id?.substr(0, 6).toUpperCase()}</h4>
         <div className="details_boxwrapper">
            <Image
              src="https://images.pexels.com/photos/8832766/pexels-photo-8832766.jpeg"
              alt="Top view of a starfish on the beach"
              width={150}
              height={150} 
            />
          <div className="details__box">
            <h4>Seller Details</h4>
            <div className="detail_wrapper"><h5>Name: </h5><p>{data?.sellerDetails?.name}</p></div>
            <div className="detail_wrapper"><h5>Address: </h5><p>{data?.sellerDetails?.address}, {data?.sellerDetails?.city}, {data?.sellerDetails?.postalCode}</p></div>
            <div className="detail_wrapper"><h5>Country: </h5><p>{data?.sellerDetails?.country}</p></div>
            <div className="detail_wrapper"><h5>PAN No.: </h5><p>{data?.sellerDetails?.pan}</p></div>
            <div className="detail_wrapper"><h5>GST Registration No.: </h5><p>{data?.sellerDetails?.gst}</p></div>
          </div>
         </div>
        </div>

            <div className="table_wrapper">
            <Table 
              columns={invoicedetail?.columns} 
              dataSource={invoicedetail?.dataSource} 
              pagination={false}
              scroll={{ x: '100%' }} 
              tableLayout="auto"
           />
            </div>
            
            
            <div className="details__box">
              <div className="details_boxwrapper">
                <div className="details__box">
                  <h4>Billing Details:</h4>
                  <div className="detail_wrapper"><h5>Name: </h5><p>{data?.billingDetails?.name}</p></div>
                  <div className="detail_wrapper"><h5>Address: </h5><p>{data?.billingDetails?.address}, {data?.sellerDetails?.city}, {data?.sellerDetails?.postalCode}</p></div>
                  <div className="detail_wrapper"><h5>Country: </h5><p>{data?.billingDetails?.country}</p></div>
                </div>
              </div>
              </div>

              <div className="details__box">
              <div className="details_boxwrapper">
                <div className="details__box">
                  <h4>Shipping Details:</h4>
                  <div className="detail_wrapper"><h5>Name: </h5><p>{data?.shippingDetails?.name}</p></div>
                  <div className="detail_wrapper"><h5>Address: </h5><p>{data?.shippingDetails?.address}, {data?.sellerDetails?.city}, {data?.sellerDetails?.postalCode}</p></div>
                  <div className="detail_wrapper"><h5>Country: </h5><p>{data?.shippingDetails?.country}</p></div>
                </div>
              </div>
              </div>
        

              <div className="table_wrapper">
              <Table 
                columns={productdetail.columns} 
                dataSource={productdetail.dataSource} 
                pagination={false}
                scroll={{ x: '100%' }} // Horizontal scrolling
                tableLayout="auto"

               />
              </div>
             <div className="table_wrapper">
              <Table 
                columns={amountdetail.columns} 
                dataSource={amountdetail.dataSource} 
                pagination={false}
                scroll={{ x: '100%' }} // Horizontal scrolling
                tableLayout="auto"

              />
             </div>
       
      </div> 
    </div>

     
  );
};

export default InvoiceDetails;















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
