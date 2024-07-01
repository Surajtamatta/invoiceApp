import { MongoClient, ObjectId } from "mongodb";

async function handler(req, res) {
  const { invoiceId } = req.query;

  try {
    const client = await MongoClient.connect(
      `mongodb+srv://${process.env.USER__NAME}:${process.env.USER__PASSWORD}@cluster0.liesnjz.mongodb.net/${process.env.DATABASE__NAME}?retryWrites=true&w=majority&appName=Cluster0`
    );
    const db = client.db();
    const collection = db.collection("allInvoices");

    if (req.method === "PUT") {
      const updatedData = {
        sellerDetails: {
          name: req.body.sellerDetails.name,
          pan: req.body.sellerDetails.pan,
          gst: req.body.sellerDetails.gst,
          address: req.body.sellerDetails.address,
          city: req.body.sellerDetails.city,
          postalCode: req.body.sellerDetails.postalCode,
          country: req.body.sellerDetails.country,
        },
        billingDetails: {
          name: req.body.billingDetails.name,
          address: req.body.billingDetails.address,
          city: req.body.billingDetails.city,
          postalCode: req.body.billingDetails.postalCode,
          country: req.body.billingDetails.country,
        },
        shippingDetails: {
          name: req.body.shippingDetails.name,
          address: req.body.shippingDetails.address,
          city: req.body.shippingDetails.city,
          postalCode: req.body.shippingDetails.postalCode,
          country: req.body.shippingDetails.country,
        },
        invoiceDetails: {
          invoiceDate: req.body.invoiceDetails.invoiceDate,
          placeOfSupply: req.body.invoiceDetails.placeOfSupply,
          orderNo: req.body.invoiceDetails.orderNo,
          orderDate: req.body.invoiceDetails.orderDate,
        },
        status: req.body.status,
        items: req.body.items,
        totalAmount: req.body.totalAmount,
        
      };

      await collection.updateOne(
        { _id:new ObjectId(invoiceId) },
        {
          $set: updatedData,
        }
      );

      res.status(200).json({ message: "Invoice updated successfully" });
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    if (client) {
      await client.close();
    }
  }
}

export default handler;
