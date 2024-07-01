import React, {forwardRef } from "react";
import Image from "next/image";
import dynamic from 'next/dynamic';
import { ToWords } from 'to-words';
const Table = dynamic(() => import('antd/es/table'), { ssr: false });


const DownloadDetails = React.memo(forwardRef(({data}, ref) => {
  const toWords = new ToWords({
    localeCode: 'en-IN',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
      currencyOptions: {
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


 




const invoicedetail = {
    dataSource: [
      {
        placesupply: data?.invoiceDetails?.placeOfSupply,
        orderno: data?.invoiceDetails?.orderNo,
        orderdate:data?.invoiceDetails?.orderDate,
        invoiceno:data?.id?.substr(0, 6).toUpperCase(),
        invoicedate:data?.invoiceDetails?.invoiceDate,
      },
    ],
  
    columns: [
      {
        title: "Place of Supply",
        dataIndex: "placesupply",
        key: "placesupply",

      },
      {
        title: "Order No.",
        dataIndex: "orderno",
        key: "orderno",

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

      },
    ],
  };

const total = data?.items?.reduce((accumulator, item) => {
  const totalNet = item?.itemprice * item?.itemquantity - (item?.itemprice * item?.itemquantity * (item?.itemdiscount / 100));
  const totalTax = item?.itemprice * item?.itemquantity * (item?.taxRate / 100);
  const grandTotal = item?.itemprice * item?.itemquantity + totalTax - totalNet;

  accumulator.totalnet += totalNet;
  accumulator.totaltax += totalTax;
  accumulator.grandtotal += grandTotal;

  return accumulator;
}, {
  totalnet: 0,
  totaltax: 0,
  grandtotal: 0,
});


const amountdetail = {
  dataSource: [{
    totalnet: total?.totalnet.toFixed(2),
    totaltax: total?.totaltax.toFixed(2),
    grandtotal: total?.grandtotal.toFixed(2),
    amountword: toWords.convert(total?.grandtotal.toFixed(2)), 
  }],
  columns: [
    {
      title: "Total Net Amount",
      dataIndex: "totalnet",
      key: "totalnet",
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

    },
  ],
};


  return (


        <div className="download_main__container" ref={ref}>
      <div className="download__details">
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

            <div className="download_table_wrapper">
            <Table 
              columns={invoicedetail?.columns} 
              dataSource={invoicedetail?.dataSource} 
              pagination={false}
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
        

              <div className="download_table_wrapper">
              <Table 
                columns={productdetail.columns} 
                dataSource={productdetail.dataSource} 
                pagination={false}
                tableLayout="auto"
         
               />
              </div>
             <div className="download_table_wrapper">
              <Table 
                columns={amountdetail.columns} 
                dataSource={amountdetail.dataSource} 
                pagination={false}
                tableLayout="auto"
           
              />
             </div>
       
      </div>
    </div>

     
  );
}), () => true);

export default DownloadDetails;






