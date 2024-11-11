
// import  OrderModel   from '../../../Database/models/order.model.js';
// import  ProductModel  from '../../../Database/models/product.model.js';
// // import  sendInstallmentReminder  from '../../services/installmentReminder';
// import nodemailer from 'nodemailer';

// export async function createOrder({ userId, productId, shippingAddress, paymentMethod, totalAmount, CNIC, installmentPeriod, userEmail }) {
//   const product = await ProductModel.findById(productId);

//   if (!product) {
//     throw new Error("Product not found.");
//   }

//   let newOrder;

//   // Full Payment (card/cash) - Use the payment URL provided by the seller
//   if (paymentMethod === 'card' || paymentMethod === 'cash') {
//     newOrder = new OrderModel({
//       userId,
//       cartItems: [{ productId, quantity: 1 }],  // Single product, for simplicity
//       shippingAddress,
//       paymentMethod,
//       totalAmount,
//       payment_URL: product.payment_URL,  // Use seller's payment URL for full payment
//       isPaid: false,
//       isDelivered: false
//     });

//     await newOrder.save();

//     // Send email confirmation for full payment
//     sendOrderConfirmationEmail(userEmail, newOrder);

//     return newOrder;
//   }

//   // Installment Payment - Use the payment URL for each installment (could be the same URL)
//   if (paymentMethod === 'installment') {
//     if (totalAmount < 30000) {
//       throw new Error("Installments are only available for orders over 30,000.");
//     }

//     if (!CNIC) {
//       throw new Error("CNIC is required for installment payments.");
//     }

//     let installments = [];
//     let installmentAmount = totalAmount / installmentPeriod;
//     for (let i = 1; i <= installmentPeriod; i++) {
//       let dueDate = new Date();
//       dueDate.setMonth(dueDate.getMonth() + i);
//       installments.push({
//         installmentNumber: i,
//         amount: installmentAmount,
//         dueDate: dueDate,
//         payment_URL: product.payment_URL  // Same URL for installments (or could be unique for each)
//       });
//     }

//     newOrder = new OrderModel({
//       userId,
//       cartItems: [{ productId, quantity: 1 }],  // Single product, for simplicity
//       shippingAddress,
//       paymentMethod,
//       totalAmount,
//       CNIC,
//       Installments: installments,
//       isPaid: false,
//       isDelivered: false
//     });

//     await newOrder.save();

//     // Send email confirmation for installment payment
//     sendOrderConfirmationEmail(userEmail, newOrder);

//     return newOrder;
//   }

//   throw new Error("Invalid payment method.");
// }

// async function sendOrderConfirmationEmail(userEmail, order) {
//   // Set up email transport using your email service provider (example: Gmail)
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'your-email@gmail.com', // Your email address
//       pass: 'your-email-password'   // Your email password (or use app-specific password)
//     }
//   });

//   const orderDetails = order.cartItems.map(item => 
//     `${item.quantity} x ${item.productId} (Total: ${item.quantity * order.totalAmount})`
//   ).join('\n');

//   const mailOptions = {
//     from: 'your-email@gmail.com', // Sender address
//     to: userEmail, // Recipient address
//     subject: 'Order Confirmation - Your Order has been Placed',
//     text: `Dear Customer,

//     Your order has been successfully placed! Here are your order details:
    
//     Order ID: ${order._id}
//     Payment Method: ${order.paymentMethod}
//     Shipping Address: ${order.shippingAddress}
    
//     Items:
//     ${orderDetails}
    
//     Total Amount: ${order.totalAmount}
    
//     Thank you for shopping with us! Your order will be processed soon.

//     Regards,
//     The Team`
//   };

//   // Send the email
//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Order confirmation email sent successfully!');
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// }
