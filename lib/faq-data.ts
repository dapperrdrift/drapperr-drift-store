export interface FAQ {
  question: string
  answer: string
}

export interface FAQCategory {
  name: string
  faqs: FAQ[]
}

export const faqCategories: FAQCategory[] = [
  {
    name: "Orders & Shipping",
    faqs: [
      {
        question: "How do I track my order?",
        answer:
          "Once your order is shipped, you'll receive an email with a tracking number and link. You can also track your order by logging into your account and visiting the 'Orders' section, or use our Track Order page.",
      },
      {
        question: "What are the shipping options available?",
        answer:
          "We offer Standard Shipping (5-7 business days), Express Shipping (2-3 business days), and Same-Day Delivery in select cities. Shipping is complimentary on orders over Rs. 5,000.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Currently, we ship within India only. We're working on expanding our shipping to international destinations. Please check back soon or subscribe to our newsletter for updates.",
      },
      {
        question: "Can I change my shipping address after placing an order?",
        answer:
          "Address changes can be made within 2 hours of placing your order. Please contact our customer support immediately at support@dapperr.com or call our helpline.",
      },
    ],
  },
  {
    name: "Returns & Exchanges",
    faqs: [
      {
        question: "What is your return policy?",
        answer:
          "We offer a 30-day return policy for all unworn items with tags attached. Items must be in their original condition and packaging. Sale items are final sale and cannot be returned.",
      },
      {
        question: "How do I initiate a return?",
        answer:
          "Log into your account, go to 'Orders', select the item you wish to return, and click 'Request Return'. You'll receive a prepaid shipping label via email within 24 hours.",
      },
      {
        question: "How long does it take to process a refund?",
        answer:
          "Once we receive your return, it takes 3-5 business days to inspect and process. Refunds are credited to your original payment method within 7-10 business days after processing.",
      },
      {
        question: "Can I exchange an item for a different size?",
        answer:
          "Yes! You can request an exchange for a different size within 30 days. If the requested size is unavailable, we'll process a full refund instead.",
      },
    ],
  },
  {
    name: "Payment & Billing",
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit/debit cards (Visa, Mastercard, American Express), UPI, Net Banking, and popular wallets like Paytm and PhonePe. We also offer Cash on Delivery in select locations.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Absolutely. We use industry-standard SSL encryption and partner with Razorpay for secure payment processing. Your card details are never stored on our servers.",
      },
      {
        question: "Can I use multiple payment methods for one order?",
        answer:
          "Currently, we only support one payment method per order. However, you can combine payment with store credit or gift cards.",
      },
      {
        question: "Do you offer EMI options?",
        answer:
          "Yes, we offer no-cost EMI on orders above Rs. 10,000 through select bank credit cards. EMI options are displayed at checkout if your order qualifies.",
      },
    ],
  },
  {
    name: "Products & Sizing",
    faqs: [
      {
        question: "How do I find my size?",
        answer:
          "Visit our Size Guide page for detailed measurements and fitting tips. Each product page also includes specific sizing information. When in doubt, we recommend sizing up.",
      },
      {
        question: "Are your products true to size?",
        answer:
          "Our garments are designed to fit true to size based on standard Indian measurements. Product-specific fit information (slim, regular, relaxed) is mentioned on each product page.",
      },
      {
        question: "How do I care for my garments?",
        answer:
          "Care instructions are provided on the product label and product page. Generally, we recommend cold water wash, mild detergent, and air drying for best results.",
      },
      {
        question: "Are the product colors accurate online?",
        answer:
          "We strive to display colors as accurately as possible. However, slight variations may occur due to screen settings. If you're unsure, contact us for additional product images.",
      },
    ],
  },
  {
    name: "Account & Privacy",
    faqs: [
      {
        question: "How do I create an account?",
        answer:
          "Click 'Sign In' at the top of the page, then select 'Create Account'. You'll need to provide your email, create a password, and fill in basic details. You can also sign up during checkout.",
      },
      {
        question: "How can I reset my password?",
        answer:
          "Click 'Sign In', then 'Forgot Password'. Enter your email address and we'll send you a password reset link valid for 24 hours.",
      },
      {
        question: "How do you protect my personal information?",
        answer:
          "We take privacy seriously. Your data is encrypted, never sold to third parties, and used only for order processing and improving your shopping experience. See our Privacy Policy for details.",
      },
      {
        question: "Can I delete my account?",
        answer:
          "Yes, you can request account deletion from your Account Settings or by contacting support. Please note this action is irreversible and your order history will be permanently removed.",
      },
    ],
  },
]

export const homeFAQs: FAQ[] = [
  {
    question: "Is Dapperr Drift a Kota-based brand?",
    answer:
      "Yes — Dapperr Drift is proudly based in Kota, Rajasthan. Our flagship store is at Shop No. F6, First Floor, Shubh Affinity, Next to DMART, Swami Vivekananda Nagar, Kota. We ship across India.",
  },
  {
    question: "What kind of clothes does Dapperr Drift sell?",
    answer:
      "Dapperr Drift makes original streetwear — oversized T-shirts, hoodies, denim, co-ord sets, outerwear, and accessories — all designed in-house for India's urban generation.",
  },
  {
    question: "Does Dapperr Drift ship across India?",
    answer:
      "Yes. We ship pan-India with 48-hour dispatch from Kota. Free shipping on orders above ₹5,000. Cash on Delivery is available in most cities.",
  },
  {
    question: "How is Dapperr Drift different from other Indian streetwear brands?",
    answer:
      "Every Dapperr Drift piece is 100% original — no fast-fashion templates, no mass-produced prints. We're a Kota-born brand built for India's new generation of street-aware fashion lovers.",
  },
]

export function buildFAQSchema(faqs: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  }
}
