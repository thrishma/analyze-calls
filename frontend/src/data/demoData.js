// Demo data for showcase/demo mode
// Access via ?demo=true query parameter

export const DEMO_CALLS = [
  {
    callId: 'demo-1',
    metadata: {
      participantName: 'Sarah Chen',
      company: 'StyleHub Commerce',
      callDate: '2025-01-15T14:30:00Z',
      linkedinProfileUrl: 'https://linkedin.com/in/demo',
      notes: 'Discovery call about checkout optimization and conversion improvements'
    },
    linkedinProfile: {
      currentRole: 'VP of E-commerce',
      company: 'StyleHub Commerce',
      pastExperience: [
        { role: 'Director of Digital Commerce', company: 'FashionRetail Inc', duration: '2020-2023' },
        { role: 'E-commerce Manager', company: 'TrendyBoutique', duration: '2018-2020' },
        { role: 'Digital Marketing Lead', company: 'OnlineStyle Co', duration: '2016-2018' }
      ],
      skills: ['E-commerce Strategy', 'Conversion Optimization', 'Shopify Plus', 'Customer Analytics', 'A/B Testing']
    },
    analysis: {
      painPoints: [
        {
          description: 'Cart abandonment rate is 72%, significantly above industry average',
          severity: 'high',
          category: 'conversion',
          quote: 'Our biggest challenge is the checkout process - we\'re losing 72% of customers at cart. It\'s killing our revenue.',
          confidence: 0.95
        },
        {
          description: 'Slow page load times affecting mobile conversion rates',
          severity: 'high',
          category: 'performance',
          quote: 'Mobile users are bouncing because product pages take 4-5 seconds to load. We\'re seeing a 40% drop in mobile conversions.',
          confidence: 0.92
        },
        {
          description: 'Lack of guest checkout option forcing account creation',
          severity: 'medium',
          category: 'user experience',
          quote: 'We force account creation and customers hate it. Many just abandon instead of filling out another form.',
          confidence: 0.88
        },
        {
          description: 'Payment options limited to credit cards only',
          severity: 'medium',
          category: 'payment',
          quote: 'We only accept credit cards right now. Losing younger customers who prefer digital wallets like Apple Pay.',
          confidence: 0.90
        },
        {
          description: 'Complexity in managing multiple e-commerce platforms with different needs',
          severity: 'medium',
          category: 'operations',
          quote: 'We\'re juggling Shopify, Amazon, and our own custom checkout. Each has different requirements and it\'s overwhelming.',
          confidence: 0.89
        }
      ],
      featureRequests: [
        {
          feature: 'One-click checkout similar to Amazon',
          priority: 'high',
          category: 'checkout',
          quote: 'If we could implement one-click checkout like Amazon, it would transform our conversion rate overnight.',
          confidence: 0.93
        },
        {
          feature: 'Multiple payment options including digital wallets',
          priority: 'high',
          category: 'payment',
          quote: 'Need to add Apple Pay, Google Pay, PayPal, and maybe even cryptocurrency options.',
          confidence: 0.91
        },
        {
          feature: 'Guest checkout without account creation',
          priority: 'high',
          category: 'checkout',
          quote: 'Let people buy without creating an account first. Capture email at the end for marketing.',
          confidence: 0.89
        },
        {
          description: 'Real-time inventory visibility on product pages',
          priority: 'medium',
          category: 'inventory',
          quote: 'Customers want to see if items are in stock before adding to cart. Reduces frustration.',
          confidence: 0.85
        }
      ],
      objections: [
        {
          concern: 'Migration complexity and downtime risk',
          category: 'implementation',
          quote: 'My main worry is migration. We can\'t afford any downtime during peak shopping season.',
          severity: 'high',
          confidence: 0.90
        },
        {
          concern: 'PCI compliance requirements with new payment processor',
          category: 'security',
          quote: 'How do you handle PCI compliance? Our current setup is certified and I don\'t want to lose that.',
          severity: 'medium',
          confidence: 0.87
        },
        {
          concern: 'Pricing compared to current Shopify Plus plan',
          category: 'cost',
          quote: 'We\'re paying $2000/month for Shopify Plus. Need to understand if this is comparable value.',
          severity: 'medium',
          confidence: 0.92
        }
      ]
    },
    summary: 'StyleHub Commerce is experiencing significant cart abandonment (72%) and mobile conversion issues. Primary needs are checkout optimization, multiple payment options, and performance improvements. Main concerns around migration complexity and maintaining PCI compliance.',
    transcript: `Interviewer: Thanks for taking the time to chat with me today, Sarah. I'd love to learn more about your e-commerce operations at StyleHub Commerce.

Sarah Chen: Of course! Happy to share what we're working on.

Interviewer: Great. So tell me, what are some of the biggest challenges you're facing right now with your online store?

Sarah Chen: Well, our biggest challenge is the checkout process - we're losing 72% of customers at cart. It's killing our revenue. We've tried a few things but nothing seems to move the needle significantly.

Interviewer: That's a really high abandonment rate. What do you think is causing that?

Sarah Chen: There are a few things. First, our checkout flow has too many steps. Customers have to create an account, fill out shipping, then billing, then review. It's just too much friction. We force account creation and customers hate it. Many just abandon instead of filling out another form.

Interviewer: I see. Are there other factors contributing to the abandonment?

Sarah Chen: Definitely. Mobile users are bouncing because product pages take 4-5 seconds to load. We're seeing a 40% drop in mobile conversions compared to desktop. And we only accept credit cards right now. Losing younger customers who prefer digital wallets like Apple Pay.

Interviewer: That's tough. What would your ideal solution look like?

Sarah Chen: If we could implement one-click checkout like Amazon, it would transform our conversion rate overnight. And we need to add Apple Pay, Google Pay, PayPal, and maybe even cryptocurrency options. Let people buy without creating an account first. Capture email at the end for marketing.

Interviewer: Makes sense. What about the mobile performance issues?

Sarah Chen: We need to optimize everything - images, code, the whole stack. Our mobile experience is way behind desktop. We know mobile is the future but we haven't prioritized it enough.

Interviewer: Are there any other features on your wishlist?

Sarah Chen: Yes! Customers want to see if items are in stock before adding to cart. Reduces frustration. Right now they add to cart and then find out at checkout that something is backordered. Super annoying.

Interviewer: I can imagine. Now, if you were to implement these changes, what concerns would you have?

Sarah Chen: My main worry is migration. We can't afford any downtime during peak shopping season. We're heading into Q4 and that's when we make 60% of our annual revenue. Any platform change would need to happen in January or February.

Interviewer: That makes sense. What about security and compliance?

Sarah Chen: How do you handle PCI compliance? Our current setup is certified and I don't want to lose that. We've worked hard to build trust with our customers and can't have any security issues.

Interviewer: Understandable. What about cost?

Sarah Chen: We're paying $2000/month for Shopify Plus. Need to understand if this is comparable value. I need to justify any change to our CEO, so the ROI needs to be crystal clear.

Interviewer: Got it. Is there anything else you'd want to see in a new solution?

Sarah Chen: Better analytics would be huge. Right now we're piecing together data from Google Analytics, Shopify, and our email platform. Having unified reporting would save us hours every week.

Interviewer: That's really helpful feedback, Sarah. Thank you so much for your time today.

Sarah Chen: My pleasure! Looking forward to seeing what you come up with.`
  },
  {
    callId: 'demo-2',
    metadata: {
      participantName: 'Mike Rodriguez',
      company: 'FreshMart Direct',
      callDate: '2025-01-12T10:00:00Z',
      linkedinProfileUrl: 'https://linkedin.com/in/demo',
      notes: 'Discussion about inventory management and multi-channel selling'
    },
    linkedinProfile: {
      currentRole: 'Owner & CEO',
      company: 'FreshMart Direct',
      pastExperience: [
        { role: 'Operations Manager', company: 'GroceryHub', duration: '2018-2021' },
        { role: 'Supply Chain Coordinator', company: 'FoodDistributors Inc', duration: '2015-2018' }
      ],
      skills: ['Supply Chain Management', 'Inventory Planning', 'Multi-channel Retail', 'Operations', 'Logistics']
    },
    analysis: {
      painPoints: [
        {
          description: 'Manual inventory sync between warehouse and online store',
          severity: 'high',
          category: 'inventory',
          quote: 'Right now we manually update inventory twice a day. By afternoon, our online stock counts are completely wrong.',
          confidence: 0.94
        },
        {
          description: 'Overselling issues leading to customer refunds',
          severity: 'high',
          category: 'fulfillment',
          quote: 'We oversold 15 times last month because inventory wasn\'t synced. Had to refund customers and lost their trust.',
          confidence: 0.96
        },
        {
          description: 'Managing inventory across Amazon, website, and physical store is overwhelming',
          severity: 'medium',
          category: 'operations',
          quote: 'We sell on our website, Amazon, and have a physical store. Keeping track of everything is a nightmare.',
          confidence: 0.89
        },
        {
          description: 'Complexity in managing multiple e-commerce platforms with different needs',
          severity: 'medium',
          category: 'operations',
          quote: 'There\'s a lot of common things that could be automated between those things, and there\'s also platform specific things that maybe cannot be accelerated.',
          confidence: 0.87
        }
      ],
      featureRequests: [
        {
          feature: 'Real-time inventory sync across all sales channels',
          priority: 'high',
          category: 'inventory',
          quote: 'Need real-time sync across our website, Amazon, and POS system. When something sells in-store, it should update everywhere instantly.',
          confidence: 0.95
        },
        {
          feature: 'Low stock alerts and auto-reorder triggers',
          priority: 'high',
          category: 'automation',
          quote: 'Would love automatic alerts when stock runs low and maybe even auto-reorder from suppliers.',
          confidence: 0.88
        },
        {
          feature: 'Unified dashboard showing inventory across all channels',
          priority: 'medium',
          category: 'analytics',
          quote: 'Want one dashboard where I can see what\'s selling where. Right now I have to check three different systems.',
          confidence: 0.90
        }
      ],
      objections: [
        {
          concern: 'Integration with existing POS system',
          category: 'technical',
          quote: 'We use Square for our physical store. Does this integrate with Square POS or do we need to switch?',
          severity: 'high',
          confidence: 0.91
        },
        {
          concern: 'Learning curve for staff members',
          category: 'adoption',
          quote: 'My team isn\'t super tech-savvy. How long does it take to train people on this?',
          severity: 'medium',
          confidence: 0.85
        }
      ]
    },
    summary: 'FreshMart Direct struggles with manual inventory management across multiple channels (website, Amazon, physical store). Critical needs are real-time inventory sync and automation. Main concerns about POS integration and ease of use for non-technical staff.'
  },
  {
    callId: 'demo-3',
    metadata: {
      participantName: 'Jennifer Park',
      company: 'LuxeBeauty Online',
      callDate: '2025-01-10T15:45:00Z',
      linkedinProfileUrl: 'https://linkedin.com/in/demo',
      notes: 'Customer retention and personalization discussion'
    },
    linkedinProfile: {
      currentRole: 'Head of Customer Experience',
      company: 'LuxeBeauty Online',
      pastExperience: [
        { role: 'CX Manager', company: 'BeautyBrands Corp', duration: '2021-2024' },
        { role: 'Customer Success Lead', company: 'SkincareHub', duration: '2019-2021' }
      ],
      skills: ['Customer Experience', 'Retention Strategy', 'Personalization', 'CRM', 'Email Marketing']
    },
    analysis: {
      painPoints: [
        {
          description: 'Low customer retention rate with poor repeat purchase rates',
          severity: 'high',
          category: 'retention',
          quote: 'Only 15% of customers come back for a second purchase. We\'re spending a fortune on acquisition and not retaining anyone.',
          confidence: 0.93
        },
        {
          description: 'Generic product recommendations not relevant to customers',
          severity: 'medium',
          category: 'personalization',
          quote: 'Our product recommendations are basically random. They don\'t consider skin type, previous purchases, or browsing history.',
          confidence: 0.88
        },
        {
          description: 'Email campaigns have poor engagement (8% open rate)',
          severity: 'medium',
          category: 'marketing',
          quote: 'Our email open rate is 8% and click-through is even worse. We\'re just spamming the same message to everyone.',
          confidence: 0.90
        }
      ],
      featureRequests: [
        {
          feature: 'AI-powered personalized product recommendations',
          priority: 'high',
          category: 'personalization',
          quote: 'Want recommendations based on skin type, purchase history, and what similar customers bought. Like Netflix but for skincare.',
          confidence: 0.92
        },
        {
          feature: 'Subscription/auto-replenishment for consumables',
          priority: 'high',
          category: 'retention',
          quote: 'Most of our products last 30-60 days. Should offer auto-ship subscriptions at a discount.',
          confidence: 0.89
        },
        {
          feature: 'Segmented email campaigns based on customer behavior',
          priority: 'medium',
          category: 'marketing',
          quote: 'Need to segment emails by skin type, purchase frequency, cart abandoners, etc. One-size-fits-all isn\'t working.',
          confidence: 0.87
        }
      ],
      objections: [
        {
          concern: 'Data privacy and GDPR compliance',
          category: 'legal',
          quote: 'If we\'re tracking behavior and personalizing, how do we handle GDPR and customer data privacy?',
          severity: 'high',
          confidence: 0.91
        },
        {
          concern: 'Cost per customer for AI personalization',
          category: 'cost',
          quote: 'Is there a per-customer cost for the AI recommendations? Need to make sure margins still work.',
          severity: 'medium',
          confidence: 0.86
        }
      ]
    },
    summary: 'LuxeBeauty Online has low customer retention (15% repeat rate) and poor email engagement. Needs AI-powered personalization, subscription offerings, and segmented marketing. Concerned about data privacy compliance and per-customer costs.'
  },
  {
    callId: 'demo-4',
    metadata: {
      participantName: 'David Thompson',
      company: 'TechGadgets Pro',
      callDate: '2025-01-08T11:30:00Z',
      linkedinProfileUrl: 'https://linkedin.com/in/demo',
      notes: 'International expansion and multi-currency support'
    },
    linkedinProfile: {
      currentRole: 'Director of International Sales',
      company: 'TechGadgets Pro',
      pastExperience: [
        { role: 'Global Sales Manager', company: 'ElectronicsWorld', duration: '2020-2024' },
        { role: 'Export Coordinator', company: 'GadgetZone', duration: '2017-2020' }
      ],
      skills: ['International Business', 'Cross-border E-commerce', 'Sales Strategy', 'Market Expansion', 'Logistics']
    },
    analysis: {
      painPoints: [
        {
          description: 'High cart abandonment from international customers due to currency conversion confusion',
          severity: 'high',
          category: 'international',
          quote: 'International customers abandon carts when they see USD prices. They want to see prices in their local currency upfront.',
          confidence: 0.94
        },
        {
          description: 'Shipping costs calculated at checkout surprise customers',
          severity: 'high',
          category: 'shipping',
          quote: 'Customers get to checkout and shipping is $30 to Europe. They\'re shocked and abandon. We need transparent shipping earlier.',
          confidence: 0.92
        },
        {
          description: 'Complex customs and duties process confusing buyers',
          severity: 'medium',
          category: 'compliance',
          quote: 'Customers in the EU have no idea about customs duties. We get complaints and returns because of unexpected charges.',
          confidence: 0.87
        },
        {
          description: 'Complexity in managing multiple e-commerce platforms with different needs',
          severity: 'medium',
          category: 'operations',
          quote: 'We have different storefronts for different regions, each with their own payment processors and shipping providers. It\'s complex to manage.',
          confidence: 0.85
        }
      ],
      featureRequests: [
        {
          feature: 'Multi-currency pricing with automatic conversion',
          priority: 'high',
          category: 'international',
          quote: 'Need to show prices in local currency based on IP location. Euro for EU, GBP for UK, etc.',
          confidence: 0.95
        },
        {
          feature: 'Transparent shipping and duties calculator',
          priority: 'high',
          category: 'shipping',
          quote: 'Show total landed cost including shipping and duties BEFORE checkout. Transparency builds trust.',
          confidence: 0.90
        },
        {
          feature: 'Region-specific payment methods (iDEAL, Klarna, etc.)',
          priority: 'medium',
          category: 'payment',
          quote: 'In Netherlands they use iDEAL, Germany loves Klarna. Need local payment options per country.',
          confidence: 0.88
        }
      ],
      objections: [
        {
          concern: 'Currency exchange rate fluctuations affecting margins',
          category: 'financial',
          quote: 'If we show prices in multiple currencies, how do we protect margins when exchange rates fluctuate?',
          severity: 'high',
          confidence: 0.89
        },
        {
          concern: 'Tax and VAT compliance across different countries',
          category: 'legal',
          quote: 'VAT rules are different in every EU country. How does the system handle tax calculation and compliance?',
          severity: 'high',
          confidence: 0.93
        }
      ]
    },
    summary: 'TechGadgets Pro faces international expansion challenges with currency conversion, shipping transparency, and customs complexity. Requires multi-currency support, landed cost calculator, and local payment methods. Main concerns around exchange rate risk and VAT compliance.'
  },
  {
    callId: 'demo-5',
    metadata: {
      participantName: 'Amanda Foster',
      company: 'HomeDecor Haven',
      callDate: '2025-01-05T13:00:00Z',
      linkedinProfileUrl: 'https://linkedin.com/in/demo',
      notes: 'Product visualization and reducing returns'
    },
    linkedinProfile: {
      currentRole: 'Chief Product Officer',
      company: 'HomeDecor Haven',
      pastExperience: [
        { role: 'Product Director', company: 'FurnitureOnline', duration: '2021-2024' },
        { role: 'UX Design Lead', company: 'InteriorStyle Co', duration: '2019-2021' }
      ],
      skills: ['Product Strategy', 'UX Design', 'AR/VR', 'Customer Insights', 'Data Analytics']
    },
    analysis: {
      painPoints: [
        {
          description: 'Return rate of 25% due to color/size mismatches',
          severity: 'high',
          category: 'returns',
          quote: 'Quarter of our orders get returned because the color or size doesn\'t match expectations. It\'s destroying our margins.',
          confidence: 0.95
        },
        {
          description: 'Customers can\'t visualize furniture in their space',
          severity: 'high',
          category: 'visualization',
          quote: 'People buy a couch and it\'s too big for their living room. They can\'t visualize dimensions from photos.',
          confidence: 0.91
        },
        {
          description: 'Limited product images and no 360-degree views',
          severity: 'medium',
          category: 'content',
          quote: 'We have 3-4 photos per product. Customers want to see every angle, close-ups of fabric, etc.',
          confidence: 0.88
        }
      ],
      featureRequests: [
        {
          feature: 'AR room visualization (see furniture in your space)',
          priority: 'high',
          category: 'visualization',
          quote: 'AR feature like IKEA has would be game-changing. Let customers place furniture in their room using their phone.',
          confidence: 0.93
        },
        {
          feature: '360-degree product views and zoom functionality',
          priority: 'high',
          category: 'content',
          quote: 'Want interactive 360-degree views and high-res zoom on all products. Let people examine details like in a store.',
          confidence: 0.89
        },
        {
          feature: 'Size recommendation tool based on room dimensions',
          priority: 'medium',
          category: 'recommendation',
          quote: 'Tool where customers enter room dimensions and we recommend appropriate furniture sizes.',
          confidence: 0.85
        }
      ],
      objections: [
        {
          concern: 'Cost and complexity of creating AR content',
          category: 'production',
          quote: 'We have 2,000 products. How much does it cost to create AR models for everything?',
          severity: 'high',
          confidence: 0.90
        },
        {
          concern: 'Mobile device compatibility for AR features',
          category: 'technical',
          quote: 'Do customers need the latest iPhone for AR? What about Android users?',
          severity: 'medium',
          confidence: 0.87
        }
      ]
    },
    summary: 'HomeDecor Haven has 25% return rate due to visualization issues and expectation mismatches. Needs AR room preview, 360-degree product views, and size recommendation tools. Concerns about AR content creation costs and device compatibility.'
  },
  {
    callId: 'demo-6',
    metadata: {
      participantName: 'Robert Kim',
      company: 'ActiveGear Sports',
      callDate: '2025-01-03T09:15:00Z',
      linkedinProfileUrl: 'https://linkedin.com/in/demo',
      notes: 'Mobile-first strategy and app development'
    },
    linkedinProfile: {
      currentRole: 'VP of Digital',
      company: 'ActiveGear Sports',
      pastExperience: [
        { role: 'Digital Strategy Director', company: 'FitnessBrands Inc', duration: '2020-2024' },
        { role: 'Mobile Product Manager', company: 'SportsRetail Co', duration: '2017-2020' }
      ],
      skills: ['Mobile Strategy', 'App Development', 'Digital Transformation', 'Agile', 'User Acquisition']
    },
    analysis: {
      painPoints: [
        {
          description: '65% of traffic is mobile but only 30% of conversions',
          severity: 'high',
          category: 'mobile',
          quote: 'Two-thirds of our traffic is mobile but they\'re not buying. Desktop converts 3x better than mobile.',
          confidence: 0.96
        },
        {
          description: 'Mobile website is slow and hard to navigate',
          severity: 'high',
          category: 'performance',
          quote: 'Our mobile site takes forever to load and the navigation is clunky. Users get frustrated and leave.',
          confidence: 0.93
        },
        {
          description: 'No native app, losing to competitors who have apps',
          severity: 'medium',
          category: 'competition',
          quote: 'Nike, Adidas, all our competitors have apps with exclusive drops and rewards. We\'re losing brand loyalty.',
          confidence: 0.89
        },
        {
          description: 'Low customer retention rate with poor repeat purchase rates',
          severity: 'high',
          category: 'retention',
          quote: 'Only about 20% of our customers come back. We spend so much on acquisition but can\'t keep them.',
          confidence: 0.91
        }
      ],
      featureRequests: [
        {
          feature: 'Native mobile app with push notifications',
          priority: 'high',
          category: 'mobile',
          quote: 'Need a native app for iOS and Android. Push notifications for new drops, sales, and order updates.',
          confidence: 0.94
        },
        {
          feature: 'Mobile-optimized checkout (Apple Pay, Google Pay)',
          priority: 'high',
          category: 'checkout',
          quote: 'Mobile checkout should be one-tap with Apple Pay or Google Pay. Our current process is way too long.',
          confidence: 0.92
        },
        {
          feature: 'In-app exclusive products and early access',
          priority: 'medium',
          category: 'engagement',
          quote: 'Want to reward app users with exclusive products and early access to sales. Build brand loyalty.',
          confidence: 0.87
        }
      ],
      objections: [
        {
          concern: 'App development and maintenance costs',
          category: 'cost',
          quote: 'We\'re a small team. Can we afford to build and maintain iOS and Android apps?',
          severity: 'high',
          confidence: 0.90
        },
        {
          concern: 'App store approval process and timeline',
          category: 'timeline',
          quote: 'How long does it take to get approved by Apple and Google? We want to launch before Q4.',
          severity: 'medium',
          confidence: 0.85
        }
      ]
    },
    summary: 'ActiveGear Sports has poor mobile conversion (30%) despite 65% mobile traffic. Needs native mobile app with push notifications, optimized checkout, and exclusive features. Concerns about development costs and app store approval timeline.'
  }
];

// Pre-populated chatbot Q&A for demo
export const DEMO_CHATBOT_HISTORY = [
  {
    id: 'demo-chat-1',
    query: 'What are the main pain points across all customer calls?',
    answer: `Based on analysis of 6 customer discovery calls, the most frequent pain points are:

**High Priority Issues:**
1. **Cart/Checkout Abandonment** - Multiple merchants report 65-72% abandonment rates
2. **Mobile Conversion Problems** - Mobile traffic is high (65%) but conversions are low (30%)
3. **Inventory Management** - Manual sync causing overselling and customer refunds
4. **International Currency Issues** - Currency conversion confusion leading to cart abandonment

**Supporting Quotes:**
- "Our biggest challenge is the checkout process - we're losing 72% of customers at cart." - Sarah Chen, StyleHub Commerce
- "Right now we manually update inventory twice a day. By afternoon, our online stock counts are completely wrong." - Mike Rodriguez, FreshMart Direct
- "International customers abandon carts when they see USD prices." - David Thompson, TechGadgets Pro`,
    sources: [
      { callId: 'demo-1', participant: 'Sarah Chen', company: 'StyleHub Commerce' },
      { callId: 'demo-2', participant: 'Mike Rodriguez', company: 'FreshMart Direct' },
      { callId: 'demo-4', participant: 'David Thompson', company: 'TechGadgets Pro' }
    ],
    timestamp: '2025-01-15T16:20:00Z'
  },
  {
    id: 'demo-chat-2',
    query: 'What features are customers requesting most frequently?',
    answer: `Top feature requests across 6 calls:

**Most Requested (4+ mentions):**
1. **One-Click Checkout** - Fast checkout like Amazon
2. **Multi-Currency Support** - Show prices in local currency
3. **Real-time Inventory Sync** - Across all sales channels
4. **Multiple Payment Options** - Digital wallets (Apple Pay, Google Pay, PayPal)

**High-Impact Requests:**
5. **AR Product Visualization** - See furniture/products in your space
6. **Native Mobile App** - Push notifications and exclusive features
7. **AI Personalization** - Product recommendations based on behavior

**Customer Quotes:**
- "If we could implement one-click checkout like Amazon, it would transform our conversion rate overnight." - Sarah Chen
- "AR feature like IKEA has would be game-changing." - Amanda Foster
- "Need real-time sync across our website, Amazon, and POS system." - Mike Rodriguez`,
    sources: [
      { callId: 'demo-1', participant: 'Sarah Chen', company: 'StyleHub Commerce' },
      { callId: 'demo-3', participant: 'Jennifer Park', company: 'LuxeBeauty Online' },
      { callId: 'demo-5', participant: 'Amanda Foster', company: 'HomeDecor Haven' }
    ],
    timestamp: '2025-01-15T16:25:00Z'
  },
  {
    id: 'demo-chat-3',
    query: 'What objections or concerns do merchants have about new solutions?',
    answer: `Common objections and concerns:

**Top Concerns:**
1. **Migration Complexity & Downtime** (5 mentions)
   - "Can't afford any downtime during peak shopping season"
   - Worried about data migration and setup time

2. **Cost & ROI** (4 mentions)
   - Comparing to current solutions (Shopify Plus $2000/month)
   - Per-customer costs for AI features
   - App development maintenance costs

3. **Compliance & Security** (3 mentions)
   - PCI compliance requirements
   - GDPR and data privacy
   - VAT/tax compliance across countries

4. **Technical Integration** (3 mentions)
   - Integration with existing POS systems (Square)
   - App store approval timelines
   - AR content creation costs

**Key Insight:** Most concerns are about implementation risk and ongoing costs, not product value. Merchants see the value but worry about execution.`,
    sources: [
      { callId: 'demo-1', participant: 'Sarah Chen', company: 'StyleHub Commerce' },
      { callId: 'demo-2', participant: 'Mike Rodriguez', company: 'FreshMart Direct' },
      { callId: 'demo-4', participant: 'David Thompson', company: 'TechGadgets Pro' }
    ],
    timestamp: '2025-01-15T16:30:00Z'
  }
];

// Summary stats for demo dashboard
export const DEMO_STATS = {
  totalCalls: 6,
  totalPainPoints: 18,
  totalFeatureRequests: 21,
  totalObjections: 13,
  avgCallDuration: '45 minutes',
  topPainPoint: 'Cart/Checkout Abandonment',
  topFeatureRequest: 'One-Click Checkout',
  topObjection: 'Migration Complexity'
};
