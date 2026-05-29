const donationService = require('../services/donation.service');
const { sendSuccess, sendError } = require('../utils/response');

const getDonations = async (req, res) => {
  try {
    const donations = await donationService.listDonations({});
    return sendSuccess(res, 'Donations retrieved successfully', donations);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const getDonationStats = async (req, res) => {
  try {
    const stats = await donationService.getStats();
    return sendSuccess(res, 'Donation stats retrieved successfully', stats);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const initiateCheckout = async (req, res) => {
  try {
    const { donorName, email, amount, paymentMethod, isAnonymous } = req.body;
    const transactionId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Create a pending donation record
    const donation = await donationService.createDonation({
      donorName,
      email,
      amount,
      paymentMethod,
      transactionId,
      isAnonymous,
      status: 'completed', // For mock purposes, approve instantly
    });

    return sendSuccess(res, 'Checkout simulated successfully. Payment received.', donation, 201);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

const downloadReceipt = async (req, res) => {
  try {
    const Donation = require('../models/donation.model');
    const crypto = require('crypto');
    
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).send('Donation not found');
    }
    
    const secret = process.env.JWT_ACCESS_SECRET || 'fallback_secret';
    const payload = [
      donation._id.toString(),
      donation.amount.toString(),
      donation.transactionId,
      secret
    ].join('|');
    const signature = crypto.createHash('sha256').update(payload).digest('hex').toUpperCase();
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename=receipt_${donation.transactionId}.html`);
    
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Donation Receipt - Practon Alumni</title>
        <style>
            body { font-family: sans-serif; background: #fafafa; padding: 40px; color: #333; }
            .receipt-card { max-w: 600px; margin: 0 auto; background: white; border: 1px solid #e0e0e0; border-radius: 12px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
            .header { text-align: center; border-bottom: 2px solid #003B73; padding-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #003B73; margin: 5px 0; }
            .subtitle { font-size: 14px; color: #666; }
            .details { margin: 30px 0; line-height: 2; }
            .row { display: flex; justify-content: space-between; border-bottom: 1px dashed #eee; padding: 8px 0; }
            .label { color: #666; font-size: 13px; }
            .value { font-weight: bold; font-size: 14px; }
            .footer { border-top: 1px solid #eee; pt: 20px; text-align: center; margin-top: 30px; }
            .signature-box { background: #f4f6f9; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-family: monospace; font-size: 11px; color: #4a5568; word-break: break-all; margin-top: 15px; }
            .stamp { color: #F9A826; border: 2px solid #F9A826; display: inline-block; padding: 4px 12px; border-radius: 6px; font-weight: bold; text-transform: uppercase; font-size: 12px; margin-top: 10px; }
        </style>
    </head>
    <body>
        <div class="receipt-card">
            <div class="header">
                <div class="title">প্রাক্তন শিক্ষার্থী পরিষদ</div>
                <div class="subtitle">Practon Alumni Association Portal</div>
                <div class="stamp">Verified Donation Receipt</div>
            </div>
            <div class="details">
                <div class="row">
                    <span class="label">Donor Name</span>
                    <span class="value">${donation.donorName.en} (${donation.donorName.bn})</span>
                </div>
                <div class="row">
                    <span class="label">Email</span>
                    <span class="value">${donation.email}</span>
                </div>
                <div class="row">
                    <span class="label">Amount Paid</span>
                    <span class="value" style="color: #003B73;">৳ ${donation.amount} BDT</span>
                </div>
                <div class="row">
                    <span class="label">Payment Method</span>
                    <span class="value">${donation.paymentMethod}</span>
                </div>
                <div class="row">
                    <span class="label">Transaction ID</span>
                    <span class="value" style="font-family: monospace;">${donation.transactionId}</span>
                </div>
                <div class="row">
                    <span class="label">Date</span>
                    <span class="value">${new Date(donation.date).toLocaleDateString()}</span>
                </div>
            </div>
            <div class="footer">
                <div class="label">Cryptographic Verification Signature</div>
                <div class="signature-box">${signature}</div>
                <p style="font-size: 9px; color: #a0aec0; margin-top: 10px;">This receipt is cryptographically verified and digitally signed. No physical signature required.</p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    return res.send(html);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = {
  getDonations,
  getDonationStats,
  initiateCheckout,
  downloadReceipt,
};
