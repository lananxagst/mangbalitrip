import { Router, Request, Response } from "express";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const midtransClient = require("midtrans-client");

const router = Router();

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

interface CreateTransactionBody {
  packageTitle: string;
  packageId: string;
  passengers: number;
  pricePerPerson: number;
  totalAmount: number;
  name: string;
  email?: string;
  phone: string;
  date: string;
  pickupLocation: string;
}

router.post("/create-transaction", async (req: Request, res: Response) => {
  try {
    const {
      packageTitle,
      packageId,
      passengers,
      pricePerPerson,
      totalAmount,
      name,
      email,
      phone,
      date,
      pickupLocation,
    }: CreateTransactionBody = req.body;

    const orderId = `MBT-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalAmount,
      },
      customer_details: {
        first_name: name,
        email: email || `guest_${phone}@mangbalitrip.com`,
        phone,
      },
      item_details: [
        {
          id: packageId || "PACKAGE",
          price: pricePerPerson,
          quantity: passengers,
          name: packageTitle.slice(0, 50),
          category: "Tour Package",
        },
      ],
      custom_field1: date,
      custom_field2: pickupLocation.slice(0, 255),
    };

    const transaction = await snap.createTransaction(parameter);

    res.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      order_id: orderId,
    });
  } catch (error) {
    console.error("Midtrans error:", error);
    res.status(500).json({ message: "Failed to create payment transaction", error: String(error) });
  }
});

export default router;
