import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import { useAuth } from '../../context/AuthContext';
import BookCover from '../../components/book/BookCover';
import { FiChevronLeft, FiCreditCard, FiCheckCircle } from 'react-icons/fi';
import API from '../../api';

const Checkout = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { books } = useAppState();
  const { user, addPurchasedBook } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [upiId, setUpiId] = useState('reader@upi');
  const [loading, setLoading] = useState(false);

  const book = books.find(b => b.id.toString() === bookId.toString());

  if (!book) {
    return (
      <div className="py-20 text-center">
        <p className="text-3xl mb-4">⚠️</p>
        <h2 className="text-xl font-bold">Book Not Found</h2>
        <Link to="/browse" className="text-brand-gold font-semibold underline">Back to Browse</Link>
      </div>
    );
  }

  const handlePurchase = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    
    try {
      // 1. Create order on Django Backend (returns Razorpay Order ID)
      const orderCreateRes = await API.post('/orders/create/', {
        bookId: bookId,
        readerId: user.id
      });
      
      const { key, amount, orderId } = orderCreateRes.data;

      // 2. Configure and trigger Razorpay Checkout Overlay Modal
      const options = {
        key: key,
        amount: amount,
        currency: "INR",
        name: "VerseShelf",
        description: `Purchase: ${book.title}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            setLoading(true);
            // 3. Verify Payment signature on backend
            const verifyRes = await API.post('/orders/verify/', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data.status === "Success") {
              addPurchasedBook(bookId);
              navigate(`/success?bookId=${bookId}&orderId=${verifyRes.data.orderId}`);
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Signature verification error:", err);
            alert("Error verifying payment signature.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email
        },
        theme: {
          color: "#0B3C2A" // Premium Deep Green
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (err) {
      console.error("Razorpay order creation failed:", err);
      alert("Failed to initiate Razorpay checkout.");
      setLoading(false);
    }
  };

  return (
    <div className="py-12 md:py-20 bg-brand-warmwhite min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-semibold text-brand-gold hover:text-brand-darkgreen mb-10 transition-colors">
          <FiChevronLeft className="mr-1.5" /> Back to details
        </button>

        <h1 className="text-3xl font-serif font-black text-brand-darkgreen mb-10">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Payment Details Form */}
          <div className="md:col-span-7 bg-white border border-brand-darkgreen/5 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-serif font-bold text-brand-darkgreen mb-6 pb-3 border-b border-brand-cream">Payment Method</h3>
            
            <form onSubmit={handlePurchase} className="space-y-6">
              
              {/* Payment selector tabs */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-3 text-xs font-semibold rounded-xl border transition-all flex flex-col items-center justify-center space-y-1.5 ${
                    paymentMethod === 'card' 
                      ? 'border-brand-darkgreen bg-brand-darkgreen/5 text-brand-darkgreen shadow-sm' 
                      : 'border-brand-darkgreen/15 text-brand-charcoal/60 hover:bg-brand-cream/30'
                  }`}
                >
                  <FiCreditCard className="text-base" />
                  <span>Credit / Debit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`py-3 text-xs font-semibold rounded-xl border transition-all flex flex-col items-center justify-center space-y-1.5 ${
                    paymentMethod === 'upi' 
                      ? 'border-brand-darkgreen bg-brand-darkgreen/5 text-brand-darkgreen shadow-sm' 
                      : 'border-brand-darkgreen/15 text-brand-charcoal/60 hover:bg-brand-cream/30'
                  }`}
                >
                  <span className="font-serif font-black tracking-wide text-xs">UPI</span>
                  <span>UPI Payment</span>
                </button>
              </div>

              {/* Dynamic Payment Fields */}
              {paymentMethod === 'card' ? (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal/50 block mb-1.5">Card Number</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-brand-cream/35 border border-brand-darkgreen/15 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal/50 block mb-1.5">Expiry Date</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-brand-cream/35 border border-brand-darkgreen/15 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal/50 block mb-1.5">CVV</label>
                      <input
                        type="password"
                        required
                        maxLength="3"
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-brand-cream/35 border border-brand-darkgreen/15 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal/50 block mb-1.5">UPI ID (VPA)</label>
                    <input
                      type="text"
                      required
                      placeholder="username@bank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-brand-cream/35 border border-brand-darkgreen/15 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-darkgreen text-brand-warmwhite hover:bg-brand-gold hover:text-brand-darkgreen font-semibold py-3.5 rounded-xl shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center"
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Processing Payment...</span>
                  </span>
                ) : (
                  <span>Complete Purchase (₹{book.price})</span>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="md:col-span-5 bg-brand-cream/30 border border-brand-darkgreen/5 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-serif font-bold text-brand-darkgreen mb-6 pb-3 border-b border-brand-darkgreen/5">Order Summary</h3>
            
            <div className="flex items-center space-x-4 mb-6">
              <BookCover title={book.title} author={book.authorName} category={book.category} coverColor={book.coverColor} coverImage={book.coverImage} className="w-16 h-24 text-[8px] p-2" />
              <div>
                <h4 className="text-sm font-serif font-bold text-brand-darkgreen leading-tight">{book.title}</h4>
                <p className="text-xs text-brand-charcoal/65 mt-0.5">by {book.authorName}</p>
                <span className="inline-block text-[10px] bg-brand-gold/10 text-brand-gold px-1.5 py-0.5 rounded border border-brand-gold/10 font-semibold mt-2 uppercase tracking-wide">PDF Format</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-brand-darkgreen/5 text-sm">
              <div className="flex justify-between text-brand-charcoal/70">
                <span>Subtotal</span>
                <span>₹{book.price}</span>
              </div>
              <div className="flex justify-between text-brand-charcoal/70">
                <span>Tax / GST</span>
                <span>₹0.00</span>
              </div>
              <div className="flex justify-between font-bold text-brand-darkgreen text-base pt-3 border-t border-brand-darkgreen/5">
                <span>Total Amount</span>
                <span>₹{book.price}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
