export type LegalSection = {
  title: string;
  body: string[];
  bullets?: string[];
};

export type LegalDocument = {
  slug: string;
  title: string;
  effectiveDate: string;
  sections: LegalSection[];
};

export const LEGAL_ENTITY_NAME = "EvoScale Company Limited";
export const LEGAL_ENTITY_ADDRESS = "Unit 04-05, 16/F The Broadway, 54-62 Lockhart Road, Wan Chai, Hong Kong";
export const COMPANY_REGISTRATION_NUMBER = "77569495";
export const COMPANY_COUNTRY = "Hong Kong";
export const SUPPORT_EMAIL = "[support@myeluna.com](mailto:support@myeluna.com)";
export const SUPPORT_EMAIL_ADDRESS = "support@myeluna.com";
export const SUPPORT_MAILTO = "mailto:support@myeluna.com?subject=eLuna%20Support";
export const BILLING_SUPPORT_MAILTO = "mailto:support@myeluna.com?subject=eLuna%20Billing%20Question";
export const REFUND_SUPPORT_MAILTO = "mailto:support@myeluna.com?subject=eLuna%20Refund%20or%20Billing%20Question";
export const WEBSITE_URL = "https://www.myeluna.com";
export const APP_NAME = "eLuna";
export const GLOBAL_DISCLAIMER = "eLuna is provided for self-reflection and entertainment purposes only. It does not provide medical, psychological, legal, financial, crisis, or professional advice.";
export const SUPPORT_RESPONSE_TIME = "We usually respond within 2-3 business days.";

export const privacyPolicy: LegalDocument = {
  slug: "privacy",
  title: "Privacy Policy",
  effectiveDate: "Effective as of May 2026",
  sections: [
    {
      title: "Introduction",
      body: [
        `${APP_NAME} explains in this Privacy Policy how ${LEGAL_ENTITY_NAME} collects, stores, uses, shares, and protects information when you access ${WEBSITE_URL}, the eLuna web app, and related services.`,
        "By using eLuna, you acknowledge that you have read this Privacy Policy. If you do not agree with it, please do not use the service.",
      ],
    },
    {
      title: "Information We Collect",
      body: ["We collect information that you provide directly, information created through your use of the service, and technical information needed to operate eLuna."],
      bullets: [
        "Account information, such as your name, email address, login details, and account settings.",
        "Birth data, such as date of birth, optional time of birth, place of birth, zodiac sign, and manual zodiac override.",
        "Onboarding preferences, such as focus areas, practice styles, interests, and personalization choices.",
        "Quiz answers, profile details, and reflection preferences used to personalize the digital experience.",
        "Product content, such as readings, daily cards, reflections, affirmations, saved practice entries, and path signals.",
        "Preland or quiz context, such as source, funnel, result, UTM campaign, UTM content, ad ID, and campaign ID when present.",
        "Usage data, such as pages visited, interactions, device and browser information, IP address, and approximate location if technically available.",
        "Payment-related information handled by Stripe or other third-party payment providers. eLuna does not directly store full card details, but may receive transaction, subscription, receipt, customer, or plan metadata when payments are active.",
        "Support communications, including messages you send to support and information needed to resolve your request.",
      ],
    },
    {
      title: "How We Use Information",
      body: ["We use information only for purposes connected to operating, protecting, personalizing, and improving eLuna."],
      bullets: [
        "Provide, maintain, and troubleshoot the product.",
        "Create a personalized astrology-inspired, numerology-inspired, card, affirmation, and soul-path experience.",
        "Save your profile, preferences, progress, readings, cards, and reflections.",
        "Operate subscriptions, plan access, billing support, and purchase records when payment features are active.",
        "Respond to customer support requests.",
        "Analyze usage and improve product quality, performance, content, and onboarding.",
        "Protect the service against abuse, fraud, security incidents, and unauthorized access.",
        "Comply with legal, accounting, tax, dispute, and regulatory obligations.",
      ],
    },
    {
      title: "Cookies and Similar Technologies",
      body: [
        "eLuna may use cookies, localStorage, session storage, analytics tools, and similar technologies for login, preferences, progress, personalization, security, and product analytics.",
        "You may control cookies through your browser settings. Some features, including login, saved progress, daily card state, or preferences, may not work correctly if storage is disabled.",
      ],
    },
    {
      title: "How We Store and Protect Information",
      body: [
        "We use reasonable technical and organizational safeguards designed to protect personal information from unauthorized access, loss, misuse, or alteration.",
        "No online service can be guaranteed to be 100% secure. Data may be processed by hosting, infrastructure, authentication, analytics, support, payment, and monitoring providers that help operate eLuna.",
      ],
    },
    {
      title: "Third-Party Service Providers",
      body: ["We may use third-party providers to operate eLuna. These providers may process information only as needed to perform services for us or as required by law."],
      bullets: [
        "Hosting and infrastructure providers.",
        "Analytics and product measurement tools.",
        "Payment processors when checkout is connected.",
        "Email, support, and customer communication services.",
        "Error monitoring, logging, and security tools.",
        "Authentication providers if enabled in the future.",
      ],
    },
    {
      title: "Data Retention",
      body: [
        "We retain information for as long as needed to provide eLuna, maintain account records, support billing, resolve disputes, improve safety, prevent fraud, and meet legal obligations.",
        `You may request account deletion by contacting ${SUPPORT_EMAIL_ADDRESS}. Some information may remain in backups or records for a limited time where required for security, legal, billing, dispute, or compliance reasons.`,
      ],
    },
    {
      title: "International Transfers",
      body: [
        "Your information may be stored or processed in countries outside your country of residence. Where required, we apply safeguards intended to protect transferred information in accordance with applicable law.",
      ],
    },
    {
      title: "User Rights",
      body: [`Depending on where you live, you may have rights to access, correct, update, delete, restrict, object to processing, request a copy of your data, or unsubscribe from marketing communications. To make a request, contact ${SUPPORT_EMAIL_ADDRESS}.`],
    },
    {
      title: "No Sale of Personal Information",
      body: [
        "eLuna does not sell personal information.",
        "Based on the current production implementation reviewed before Stripe submission, eLuna does not knowingly share personal information for cross-context behavioral advertising. If advertising or analytics practices change, this Privacy Policy should be updated before those practices are used.",
      ],
    },
    {
      title: "U.S. Privacy Notice",
      body: [
        "For U.S. users, we may collect identifiers, account information, internet or device activity, approximate location inferred from technical data, commercial information related to subscriptions, and content or preferences you provide.",
        `You may request access, correction, deletion, or information about our privacy practices by contacting ${SUPPORT_EMAIL_ADDRESS}. We will respond as required by applicable law.`,
      ],
    },
    {
      title: "California Privacy Notice",
      body: [
        "California users may have rights to know, access, correct, delete, or opt out of certain uses of personal information under applicable California privacy laws.",
        "We do not sell personal information. We do not knowingly share personal information for cross-context behavioral advertising in the current implementation.",
        `California privacy requests may be sent to ${SUPPORT_EMAIL_ADDRESS}.`,
      ],
    },
    {
      title: "Children",
      body: [
        "eLuna is not intended for children under 13, and we do not knowingly collect personal information from children under 13.",
        "The service is intended for adults. Users should be at least 18 years old or the age of majority in their jurisdiction unless a parent or legal guardian is involved where permitted by law.",
      ],
    },
    {
      title: "Entertainment and Wellness Disclaimer",
      body: [
        GLOBAL_DISCLAIMER,
        "You should consult qualified professionals for medical, legal, financial, mental health, emergency, or crisis matters.",
      ],
    },
    {
      title: "Changes to This Policy",
      body: [
        "We may update this Privacy Policy from time to time. When we do, we will update the effective date. If changes are material, we may provide additional notice through the service or by email.",
      ],
    },
    {
      title: "Contact",
      body: [
        `Questions or requests may be sent to ${SUPPORT_EMAIL_ADDRESS}. ${SUPPORT_RESPONSE_TIME}`,
        LEGAL_ENTITY_NAME,
        LEGAL_ENTITY_ADDRESS,
        `Registration number: ${COMPANY_REGISTRATION_NUMBER}.`,
        `Website: ${WEBSITE_URL}.`,
      ],
    },
  ],
};

export const termsOfUse: LegalDocument = {
  slug: "terms",
  title: "Terms of Use",
  effectiveDate: "Effective as of May 2026",
  sections: [
    {
      title: "Agreement to Terms",
      body: [
        `These Terms of Use govern your access to and use of ${APP_NAME}, ${WEBSITE_URL}, the eLuna web app, content, features, and related services.`,
        "By using eLuna, you agree to these Terms, the Privacy Policy, Billing Terms, Cancellation Policy, Fulfillment / Delivery Policy, and Refund Policy. If you do not agree, do not use the service.",
      ],
    },
    {
      title: "The Service",
      body: [
        "eLuna is a digital subscription app that provides AI-powered self-reflection experiences, symbolic guidance, daily readings, personal insight prompts, and journaling-style tools. The service is designed for personal reflection and entertainment, not for professional advice or guaranteed predictions.",
        GLOBAL_DISCLAIMER,
        "eLuna does not guarantee accuracy, outcomes, future events, relationship results, health changes, financial results, or any particular life outcome.",
        "No physical goods are shipped. Access is delivered digitally through the user's eLuna account.",
      ],
    },
    {
      title: "Eligibility / Adults Only",
      body: [
        "You must be at least 18 years old, or the age of majority in your jurisdiction, to use paid eLuna subscription features.",
        "We do not knowingly collect personal information from children under 13.",
      ],
    },
    {
      title: "Account Registration",
      body: [
        "You are responsible for providing accurate account information, keeping your login credentials secure, and all activity that occurs under your account.",
        "If you believe your account has been compromised, contact support as soon as possible.",
      ],
    },
    {
      title: "Subscriptions and Paid Features",
      body: [
        "Some eLuna features may require a paid subscription or introductory access plan. Pricing and plan terms are shown before checkout when checkout is available.",
        "Current public pricing is shown in USD: Free preview $0 USD, 3-day introductory access $1.00 USD, Monthly Premium $29.99 USD/month, 3-Month Premium $59.99 USD every 3 months, and 6-Month Premium $89.99 USD every 6 months.",
        "By subscribing, you authorize recurring charges according to the plan selected at checkout until you cancel.",
        "Billing is governed by the Billing Terms. Refund requests are governed by the Refund Policy.",
      ],
    },
    {
      title: "Automatic Renewal and Cancellation",
      body: [
        "Paid subscriptions renew automatically unless canceled before the renewal deadline shown at checkout or in the applicable billing terms.",
        `You may request cancellation by contacting ${SUPPORT_EMAIL_ADDRESS}. Cancellation stops future billing after the request is processed, and access may continue until the end of the paid billing period unless stated otherwise or required by law.`,
        SUPPORT_RESPONSE_TIME,
      ],
    },
    {
      title: "User Content",
      body: [
        "You may submit birth data, preferences, reflections, journal entries, practice responses, questions, or other content to personalize eLuna.",
        "You retain ownership of your User Content. You grant eLuna a limited license to process, store, display, and use that content as needed to provide, personalize, secure, and improve the service.",
      ],
      bullets: [
        "Do not submit unlawful, harmful, abusive, infringing, explicit, misleading, or malicious content.",
        "Do not submit sensitive information unless it is necessary for the feature and you consent to its processing.",
      ],
    },
    {
      title: "Prohibited Conduct",
      body: ["You agree not to misuse eLuna or interfere with its operation."],
      bullets: [
        "Use the service for illegal purposes.",
        "Copy, resell, sublicense, or commercially exploit the service without permission.",
        "Reverse engineer, decompile, scrape, crawl, or extract data except where allowed by law.",
        "Bypass paywalls, access controls, rate limits, or security features.",
        "Upload malware or attempt unauthorized access.",
        "Harass, impersonate, threaten, or harm others.",
        "Use eLuna as a replacement for professional medical, legal, financial, psychological, crisis, or emergency advice.",
      ],
    },
    {
      title: "Intellectual Property",
      body: [
        "eLuna's brand, design, software, visuals, text, content, interface, and other materials are owned by or licensed to eLuna. No rights are transferred to you except a limited, personal, non-transferable right to use the service according to these Terms.",
      ],
    },
    {
      title: "Third-Party Services",
      body: [
        "eLuna may rely on third-party providers for hosting, payments, analytics, authentication, support, and other operational services. Third-party terms and policies may apply to those services.",
      ],
    },
    {
      title: "Disclaimers",
      body: [
        "The service is provided \"as is\" and \"as available.\" To the fullest extent permitted by law, eLuna disclaims warranties of merchantability, fitness for a particular purpose, uninterrupted operation, error-free operation, and accuracy.",
        "Symbolic interpretations, readings, prompts, and AI-generated reflections may be subjective, incomplete, or different from your personal experience.",
      ],
    },
    {
      title: "Limitation of Liability",
      body: [
        "To the fullest extent permitted by law, eLuna and its operators are not liable for indirect, incidental, consequential, special, punitive, or exemplary damages, or for decisions you make based on service content.",
      ],
    },
    {
      title: "Indemnification",
      body: [
        "You agree to defend, indemnify, and hold harmless eLuna and its operators from claims, losses, liabilities, damages, costs, and expenses arising from your misuse of the service, violation of these Terms, or unlawful User Content.",
      ],
    },
    {
      title: "Termination",
      body: [
        "eLuna may suspend or terminate access if you violate these Terms, misuse the service, create risk, or where required by law. You may stop using the service at any time and may request account deletion by contacting support.",
      ],
    },
    {
      title: "Changes to Terms",
      body: [
        "We may update these Terms from time to time. Continued use of eLuna after updated Terms become effective means you accept the updated Terms.",
      ],
    },
    {
      title: "Governing Law and Legal Review",
      body: [
        "The governing law and dispute resolution language for paid launch should be confirmed with qualified legal counsel and aligned with the Stripe account and business jurisdiction before live checkout is enabled.",
        "Nothing in these Terms limits consumer rights that cannot be waived under applicable law.",
      ],
    },
    {
      title: "Contact",
      body: [
        `Questions may be sent to ${SUPPORT_EMAIL_ADDRESS}. ${SUPPORT_RESPONSE_TIME}`,
        LEGAL_ENTITY_NAME,
        LEGAL_ENTITY_ADDRESS,
        `Registration number: ${COMPANY_REGISTRATION_NUMBER}.`,
        `Website: ${WEBSITE_URL}.`,
      ],
    },
  ],
};

export const moneyBackPolicy: LegalDocument = {
  slug: "money-back",
  title: "Refund Policy",
  effectiveDate: "Effective as of May 2026",
  sections: [
    {
      title: "Introduction",
      body: [
        "This Refund Policy explains cancellation and refund review rules for purchases made directly through myeluna.com. It forms part of the Terms of Use.",
        "eLuna is a digital subscription service. No physical goods are shipped. Digital access begins online after account creation and successful subscription activation.",
      ],
    },
    {
      title: "How to Cancel Subscription",
      body: [
        `To request cancellation, contact ${SUPPORT_EMAIL_ADDRESS}. Your request should include the email address associated with your eLuna account and should be sent before the next renewal.`,
        `${SUPPORT_RESPONSE_TIME} Cancellation stops future billing after the request is processed. Access may continue until the end of the current paid billing period unless otherwise required by law or stated at checkout.`,
        "Deleting browser data, deleting an app shortcut, or stopping use of eLuna does not cancel a subscription.",
      ],
    },
    {
      title: "How to Request a Refund or Billing Review",
      body: [
        `If you have questions about a charge, renewal, cancellation, or refund request, please contact us first at ${SUPPORT_EMAIL_ADDRESS}. This is the fastest way for us to locate your account, review the charge, and help resolve the issue.`,
        "When contacting support, please include the email address used for your eLuna account, the date of the charge, the amount, any receipt or transaction details available, and the reason for your request.",
        "Contacting eLuna support first does not limit any rights you may have under applicable consumer protection laws.",
      ],
    },
    {
      title: "Refund Eligibility",
      body: [
        "Refund requests are reviewed on a case-by-case basis. Because eLuna provides digital access after activation, refunds may not be available for periods in which the service was accessed or used, except where required by applicable law.",
        "Refunds may be considered when relevant conditions are met.",
      ],
      bullets: [
        "The purchase was made directly through myeluna.com.",
        "You contact support within 14 days of the initial purchase.",
        "You provide the purchase email, payment method, purchase date, receipt or proof of payment, and a short explanation.",
        "The issue involves a qualifying technical error, payment-processing error, duplicate charge, or service not delivered as promised.",
      ],
    },
    {
      title: "Non-Refundable Situations",
      body: ["Unless required by applicable law, refunds are generally not provided for the following situations."],
      bullets: [
        "General dissatisfaction after digital content or access has been delivered.",
        "Misunderstanding auto-renewal terms after those terms were shown before purchase.",
        "Subscription renewals after the renewal date.",
        "Failure to cancel before the introductory access or renewal deadline.",
        "Purchases made through third-party platforms, which are governed by that platform's refund process.",
        "Digital content, readings, practices, reports, or premium access already delivered, unless applicable law requires otherwise.",
      ],
    },
    {
      title: "Processing Refunds",
      body: [
        "eLuna reviews refund requests case by case. If a refund is approved, it will be issued to the original payment method where possible.",
        SUPPORT_RESPONSE_TIME,
        "Refund processing may take up to 30 days depending on the bank, card network, payment provider, or local rules.",
      ],
    },
    {
      title: "EU/EEA/Switzerland Notice",
      body: [
        "Users in the EU, EEA, Switzerland, or similar jurisdictions may have statutory withdrawal rights for digital services. Where applicable by law, those rights may be limited or waived when you consent to immediate access and the digital service begins.",
      ],
    },
    {
      title: "Certain U.S. Residents",
      body: [
        "Some U.S. states may provide specific cancellation or consumer protection rights. eLuna will comply with applicable laws where they apply.",
      ],
    },
    {
      title: "Contact",
      body: [
        `Refund and cancellation questions may be sent to ${SUPPORT_EMAIL_ADDRESS}. ${SUPPORT_RESPONSE_TIME}`,
        LEGAL_ENTITY_NAME,
        LEGAL_ENTITY_ADDRESS,
        `Registration number: ${COMPANY_REGISTRATION_NUMBER}.`,
      ],
    },
  ],
};

export const billingTerms: LegalDocument = {
  slug: "billing",
  title: "Billing Terms",
  effectiveDate: "Effective as of May 2026",
  sections: [
    {
      title: "Pricing",
      body: [
        "Current pricing is shown before checkout in U.S. dollars (USD). Prices may exclude taxes, bank fees, currency conversion charges, app store fees, or payment-provider charges.",
        "Current public pricing: Free preview $0 USD, 3-day introductory access $1.00 USD, Monthly Premium $29.99 USD/month, 3-Month Premium $59.99 USD every 3 months, and 6-Month Premium $89.99 USD every 6 months.",
        "eLuna may change prices in the future. If you do not agree with a future price or plan change, you may cancel before the next renewal.",
      ],
    },
    {
      title: "Introductory Access",
      body: [
        "eLuna may offer 3-day introductory access for $1.00 USD. This gives temporary access to premium digital features for the period shown at checkout.",
        "Unless canceled before the introductory period ends, this access may convert to a paid subscription at the price shown at checkout, currently $29.99 USD/month for monthly renewal unless another plan is selected.",
        "Introductory access terms are shown before purchase and control if they differ from this summary.",
      ],
    },
    {
      title: "Subscription Plans",
      body: ["The currently planned eLuna plan structure is listed below. Exact available plan names, prices, currencies, taxes, and renewal terms shown at checkout control if they differ."],
      bullets: [
        "Free preview: $0 USD.",
        "3-day introductory access: $1.00 USD.",
        "Monthly Premium: $29.99 USD/month.",
        "3-Month Premium: $59.99 USD every 3 months.",
        "6-Month Premium: $89.99 USD every 6 months.",
      ],
    },
    {
      title: "Payment Method",
      body: [
        "By subscribing, you authorize recurring charges according to the plan selected at checkout until you cancel.",
        "By purchasing introductory access or a subscription, you authorize charges to the payment method provided. Charges may occur immediately, after introductory access, or at renewal according to the plan terms shown at checkout.",
        "You are responsible for keeping your payment method valid and up to date.",
      ],
    },
    {
      title: "Automatic Renewal",
      body: [
        "Subscriptions renew automatically unless canceled before the renewal deadline. The renewal price, USD currency, and billing period are shown at purchase or in the subscription management flow when available.",
        `You can request cancellation anytime by contacting ${SUPPORT_EMAIL_ADDRESS}.`,
      ],
    },
    {
      title: "How to Cancel",
      body: [
        `You may cancel by contacting ${SUPPORT_EMAIL_ADDRESS} or through account/subscription management if available. Requests should be sent before introductory access or a renewal period ends.`,
        SUPPORT_RESPONSE_TIME,
        "Deleting browser data, deleting an app shortcut, deleting an account, or not using eLuna does not automatically cancel billing.",
      ],
    },
    {
      title: "Billing Questions, Cancellations, and Refund Requests",
      body: [
        `For billing questions, cancellation help, renewal questions, or refund review, please contact ${SUPPORT_EMAIL_ADDRESS} first. Our support team can help identify your subscription, explain your current plan, and review eligible refund requests according to our Money-Back Policy.`,
        "To help us respond faster, include the email used for your eLuna account and any receipt or payment details.",
      ],
    },
    {
      title: "Failed Payments",
      body: [
        "If a payment fails, your premium access may be paused, downgraded, or canceled. Payment providers may retry failed payments according to their rules.",
      ],
    },
    {
      title: "Third-Party Payment Providers",
      body: [
        "Payments may be processed by Stripe, card networks, app stores, or similar third-party payment services when integrated. eLuna does not directly store full card details.",
      ],
    },
    {
      title: "Refunds",
      body: ["Refund requests are reviewed according to our Money-Back Policy."],
    },
    {
      title: "Contact",
      body: [
        `Billing questions may be sent to ${SUPPORT_EMAIL_ADDRESS}. ${SUPPORT_RESPONSE_TIME}`,
        LEGAL_ENTITY_NAME,
        LEGAL_ENTITY_ADDRESS,
        `Registration number: ${COMPANY_REGISTRATION_NUMBER}.`,
      ],
    },
  ],
};

export const cancellationPolicy: LegalDocument = {
  slug: "cancellation",
  title: "Cancellation Policy",
  effectiveDate: "Effective as of May 2026",
  sections: [
    {
      title: "How to Cancel",
      body: [
        `To request cancellation of eLuna introductory access or a subscription, contact ${SUPPORT_EMAIL_ADDRESS}. Include the email address associated with your eLuna account so support can locate your subscription.`,
        `Cancellation requests should be sent before introductory access ends or a subscription renews. ${SUPPORT_RESPONSE_TIME}`,
        "If you started a subscription online, you may request cancellation online by emailing support from the address linked to your eLuna account. If account subscription tools become available later, those instructions may also be used.",
      ],
    },
    {
      title: "What Does Not Cancel a Subscription",
      body: [
        "Deleting browser data, removing an app shortcut, deleting local files, or simply stopping use of eLuna does not automatically cancel billing.",
        "If subscription management tools become available in your account later, you may also follow the instructions shown there.",
      ],
    },
    {
      title: "After Cancellation",
      body: [
        "When a cancellation is processed, future billing stops. Access to paid features may continue until the end of the current paid period unless otherwise required by law or stated in the plan terms shown at checkout.",
        "Support will provide confirmation or next steps after reviewing your request.",
      ],
    },
    {
      title: "Refund Requests",
      body: [
        "Refund questions should be sent to support and are reviewed according to the Money-Back Policy, account status, subscription activity, payment records, and applicable law.",
        "This Cancellation Policy does not limit any rights you may have under applicable consumer protection laws.",
      ],
    },
    {
      title: "Contact",
      body: [
        `Cancellation questions may be sent to ${SUPPORT_EMAIL_ADDRESS}. ${SUPPORT_RESPONSE_TIME}`,
        LEGAL_ENTITY_NAME,
        LEGAL_ENTITY_ADDRESS,
        `Registration number: ${COMPANY_REGISTRATION_NUMBER}.`,
      ],
    },
  ],
};

export const deliveryPolicy: LegalDocument = {
  slug: "delivery",
  title: "Fulfillment / Delivery Policy",
  effectiveDate: "Effective as of May 2026",
  sections: [
    {
      title: "Digital Service Delivery",
      body: [
        "eLuna is a digital subscription service. No physical products are shipped.",
        "After account creation and successful subscription activation, users receive online access to digital self-reflection features, symbolic guidance, readings, and account-based tools through the user's eLuna account.",
      ],
    },
    {
      title: "Free Preview Access",
      body: [
        "Free preview features are available after account creation. Free access may include limited readings, symbolic guidance previews, daily prompts, and other preview content.",
      ],
    },
    {
      title: "Paid Feature Access",
      body: [
        "Paid features become available after subscription activation and account verification. Available features may include AI-powered self-reflection experiences, daily readings, symbolic cards, personal insight prompts, journaling-style tools, practices, affirmations, and Sky Map insights, depending on the plan selected.",
        "If payment processing is interrupted, delayed, reversed, canceled, or unsuccessful, paid access may be paused, downgraded, or unavailable.",
      ],
    },
    {
      title: "Delivery Issues",
      body: [
        `If you believe your digital access was not delivered after subscription activation, contact ${SUPPORT_EMAIL_ADDRESS}. Include your account email, purchase date, amount, and any receipt or transaction details available.`,
      ],
    },
    {
      title: "No Professional Advice",
      body: [
        GLOBAL_DISCLAIMER,
      ],
    },
    {
      title: "Contact",
      body: [
        `Delivery and access questions may be sent to ${SUPPORT_EMAIL_ADDRESS}. ${SUPPORT_RESPONSE_TIME}`,
        LEGAL_ENTITY_NAME,
        LEGAL_ENTITY_ADDRESS,
        `Registration number: ${COMPANY_REGISTRATION_NUMBER}.`,
      ],
    },
  ],
};

export const supportContactPolicy: LegalDocument = {
  slug: "support",
  title: "Support / Contact",
  effectiveDate: "Effective as of June 2026",
  sections: [
    {
      title: "Contact eLuna Support",
      body: [
        `For billing questions, cancellation requests, refund requests, account access issues, delivery/access questions, or general support, contact ${SUPPORT_EMAIL_ADDRESS}.`,
        SUPPORT_RESPONSE_TIME,
      ],
    },
    {
      title: "What to Include",
      body: ["To help us locate your account and respond faster, include the relevant details for your request."],
      bullets: [
        "The email address associated with your eLuna account.",
        "For billing or refund requests: payment date, amount, receipt or transaction details, and the reason for your request.",
        "For cancellation requests: the account email and the plan or subscription you want to cancel.",
        "For access issues: the page or feature affected and any error message you saw.",
      ],
    },
    {
      title: "Digital Subscription Notice",
      body: [
        "eLuna is a digital subscription service. No physical goods are shipped.",
        GLOBAL_DISCLAIMER,
      ],
    },
    {
      title: "Company Details",
      body: [
        LEGAL_ENTITY_NAME,
        LEGAL_ENTITY_ADDRESS,
        `Registration number: ${COMPANY_REGISTRATION_NUMBER}.`,
        `Website: ${WEBSITE_URL}.`,
      ],
    },
  ],
};
