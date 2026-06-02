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

export const LEGAL_ENTITY_NAME = "[LEGAL_ENTITY_NAME]";
export const LEGAL_ENTITY_ADDRESS = "[LEGAL_ENTITY_ADDRESS]";
export const SUPPORT_EMAIL = "[support@myeluna.com](mailto:support@myeluna.com)";
export const SUPPORT_EMAIL_ADDRESS = "support@myeluna.com";
export const SUPPORT_MAILTO = "mailto:support@myeluna.com?subject=eLuna%20Support";
export const BILLING_SUPPORT_MAILTO = "mailto:support@myeluna.com?subject=eLuna%20Billing%20Question";
export const REFUND_SUPPORT_MAILTO = "mailto:support@myeluna.com?subject=eLuna%20Refund%20or%20Billing%20Question";
export const WEBSITE_URL = "https://myeluna.com";
export const APP_NAME = "eLuna";

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
        "Product content, such as readings, daily cards, reflections, affirmations, saved practice entries, and path signals.",
        "Preland or quiz context, such as source, funnel, result, UTM campaign, UTM content, ad ID, and campaign ID when present.",
        "Usage data, such as pages visited, interactions, device and browser information, IP address, and approximate location if technically available.",
        "Payment information handled by third-party payment providers. eLuna does not directly store full card details, but may receive transaction, subscription, receipt, or plan metadata when payments are active.",
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
      body: ["eLuna does not sell personal information."],
    },
    {
      title: "Entertainment and Wellness Disclaimer",
      body: [
        "eLuna guidance is for reflection, entertainment, and self-awareness. It is not medical, legal, financial, psychological, crisis, or other professional advice.",
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
      body: [`Questions or requests may be sent to ${SUPPORT_EMAIL_ADDRESS}.`, LEGAL_ENTITY_NAME, LEGAL_ENTITY_ADDRESS],
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
        "By using eLuna, you agree to these Terms, the Privacy Policy, Billing Terms, and Money-Back Policy. If you do not agree, do not use the service.",
      ],
    },
    {
      title: "The Service",
      body: [
        "eLuna provides astrology-inspired, numerology-inspired, card, reflection, daily practice, affirmation, and personal path content.",
        "The service is intended for entertainment, reflection, and self-awareness. It is not medical, legal, financial, psychological, crisis, or professional advice.",
        "eLuna does not guarantee accuracy, outcomes, future events, relationship results, health changes, financial results, or any particular life outcome.",
      ],
    },
    {
      title: "Eligibility / Adults Only",
      body: [
        "You must meet the age requirements that apply in your jurisdiction to use eLuna. If you are under 18, a parent or legal guardian must review and accept these Terms for you.",
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
        "Some eLuna features may require a paid subscription or trial. Pricing and plan terms are shown before checkout when checkout is available.",
        "Billing is governed by the Billing Terms. Refund requests are governed by the Money-Back Policy.",
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
        "Astrology-inspired, numerology-inspired, card, and symbolic interpretations may be subjective, incomplete, or different from your personal experience.",
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
      title: "Contact",
      body: [`Questions may be sent to ${SUPPORT_EMAIL_ADDRESS}.`, LEGAL_ENTITY_NAME, LEGAL_ENTITY_ADDRESS],
    },
  ],
};

export const moneyBackPolicy: LegalDocument = {
  slug: "money-back",
  title: "Money-Back Policy",
  effectiveDate: "Effective as of May 2026",
  sections: [
    {
      title: "Introduction",
      body: [
        "This Money-Back Policy explains cancellation and refund rules for purchases made directly through myeluna.com. It forms part of the Terms of Use.",
      ],
    },
    {
      title: "How to Cancel Subscription",
      body: [
        `To request cancellation, contact ${SUPPORT_EMAIL_ADDRESS}. Your request should be sent at least 24 hours before a trial ends or a subscription renews.`,
        "Deleting browser data, deleting an app shortcut, or stopping use of eLuna does not cancel a subscription. Cancellation becomes effective after support confirms the request or after you complete the cancellation steps provided to you.",
      ],
    },
    {
      title: "How to Request a Refund or Billing Review",
      body: [
        `If you have questions about a charge, renewal, cancellation, or refund request, please contact us first at ${SUPPORT_EMAIL_ADDRESS}. This is the fastest way for us to locate your account, review the charge, and help resolve the issue.`,
        "When contacting support, please include the email address used for your eLuna account, the date of the charge, the amount, and any receipt or transaction details available.",
        "Contacting eLuna support first does not limit any rights you may have under applicable consumer protection laws.",
      ],
    },
    {
      title: "Refund Eligibility",
      body: ["Refunds may be considered when all relevant conditions are met."],
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
        "Failure to cancel before the trial or renewal deadline.",
        "Purchases made through third-party platforms, which are governed by that platform's refund process.",
        "Digital content, readings, practices, reports, or premium access already delivered, unless applicable law requires otherwise.",
      ],
    },
    {
      title: "Processing Refunds",
      body: [
        "eLuna reviews refund requests case by case. If a refund is approved, it will be issued to the original payment method where possible.",
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
      body: [`Refund and cancellation questions may be sent to ${SUPPORT_EMAIL_ADDRESS}.`],
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
        "Current pricing is shown before checkout. Prices may exclude taxes, bank fees, currency conversion charges, app store fees, or payment-provider charges.",
        "eLuna may change prices in the future. If you do not agree with a future price or plan change, you may cancel before the next renewal.",
      ],
    },
    {
      title: "Trial Periods",
      body: [
        "eLuna may offer a low-cost 3-day trial for $1. The trial gives temporary access to premium features for the period shown at checkout.",
        "Unless canceled at least 24 hours before the trial ends, the trial may convert to a paid subscription at the price shown at checkout, currently $29.99/month for monthly renewal unless another plan is selected.",
        "Trial terms are shown before purchase and control if they differ from this summary.",
      ],
    },
    {
      title: "Subscription Plans",
      body: ["The currently planned eLuna plan structure is listed below. Exact available plan names, prices, currencies, taxes, and renewal terms shown at checkout control if they differ."],
      bullets: [
        "Free preview: $0.",
        "3-day trial: $1.",
        "Monthly Premium: $29.99/month.",
        "3-Month Premium: $59.99 every 3 months.",
        "6-Month Premium: $89.99 every 6 months.",
      ],
    },
    {
      title: "Payment Method",
      body: [
        "By purchasing a trial or subscription, you authorize charges to the payment method provided. Charges may occur immediately, after a trial, or at renewal according to the plan terms shown at checkout.",
        "You are responsible for keeping your payment method valid and up to date.",
      ],
    },
    {
      title: "Automatic Renewal",
      body: [
        "Subscriptions renew automatically unless canceled before the renewal deadline. The renewal price and period are shown at purchase or in the subscription management flow when available.",
      ],
    },
    {
      title: "How to Cancel",
      body: [
        `You may cancel by contacting ${SUPPORT_EMAIL_ADDRESS} or through account/subscription management if available. Requests should be sent at least 24 hours before a trial or renewal ends.`,
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
        "Payments may be processed by third-party providers such as Stripe, PayPal, card networks, app stores, or similar services if integrated. eLuna does not directly store full card details.",
      ],
    },
    {
      title: "Refunds",
      body: ["Refund requests are reviewed according to our Money-Back Policy."],
    },
    {
      title: "Contact",
      body: [`Billing questions may be sent to ${SUPPORT_EMAIL_ADDRESS}.`],
    },
  ],
};
