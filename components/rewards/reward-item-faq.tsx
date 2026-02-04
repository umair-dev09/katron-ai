"use client"

import { useState } from "react"

interface FAQ {
  question: string
  answer: string
}

interface RewardItemFAQProps {
  brandName: string
}

const brandFAQs: Record<string, FAQ[]> = {
  amazon: [
    {
      question: "How do Amazon gift cards work? / What can you buy with an Amazon gift card?",
      answer: "Amazon gift cards can be redeemed for millions of items at www.amazon.com. Once redeemed to your account, the balance automatically applies to your next eligible purchase. You can use them for physical products, digital content, Prime membership, and more."
    },
    {
      question: "Can Amazon gift cards be used anywhere? / Where can you use an Amazon gift card?",
      answer: "Amazon gift cards can only be used on Amazon.com and affiliated websites. They cannot be used at physical stores or other retailers."
    },
    {
      question: "How to activate an Amazon gift card / How to redeem an Amazon gift card / How to add a gift card to Amazon",
      answer: "Sign in to your Amazon account, go to 'Account & Lists' > 'Gift cards', enter your claim code, and click 'Apply to your balance'. The funds will be added to your account immediately."
    },
    {
      question: "Where is the claim code on an Amazon gift card?",
      answer: "For physical cards, the claim code is on the back under a protective coating. For e-gift cards, the claim code is included in the email you received."
    },
    {
      question: "How to check your Amazon gift card balance without redeeming / How much is on my Amazon gift card?",
      answer: "Sign in to your Amazon account and go to 'Account & Lists' > 'Gift card balance' to view your current balance. You can also contact Amazon customer service to check a card balance without redeeming it."
    },
    {
      question: "Can I use multiple gift cards on Amazon? / How many gift cards can you use on Amazon?",
      answer: "Yes, you can redeem multiple gift cards to your Amazon account. All balances combine into a single gift card balance that automatically applies to purchases."
    },
    {
      question: "Do Amazon gift cards expire?",
      answer: "Amazon gift cards never expire and can be used at any time. Once redeemed to your account, the balance remains valid indefinitely."
    }
  ],
  starbucks: [
    {
      question: "How do Starbucks gift cards work?",
      answer: "Starbucks gift cards can be loaded with funds and used to purchase beverages, food, and merchandise at participating Starbucks locations. You can register your card in the Starbucks app to track your balance and earn Stars rewards."
    },
    {
      question: "Where can you use a Starbucks gift card?",
      answer: "Starbucks gift cards can be used at participating Starbucks stores in the US, online at starbucks.com, and in the Starbucks mobile app."
    },
    {
      question: "How to redeem a Starbucks gift card?",
      answer: "Add the card to your Starbucks account by entering the card number and security code in the app or website under 'Manage cards'. Once added, the balance is available for use."
    },
    {
      question: "How to check Starbucks gift card balance?",
      answer: "Check your balance in the Starbucks app under 'My Cards', on starbucks.com/gift, or ask a barista at any Starbucks location."
    },
    {
      question: "Can Starbucks gift cards be reloaded?",
      answer: "Yes, Starbucks gift cards can be reloaded with additional funds through the app, website, or at any Starbucks store."
    },
    {
      question: "Do Starbucks gift cards expire?",
      answer: "Starbucks gift cards do not expire, and the funds never lose value. You can use your card whenever you like."
    },
    {
      question: "Can I earn Stars with a Starbucks gift card?",
      answer: "Yes, when you register your Starbucks gift card in the Starbucks Rewards program, you earn Stars on eligible purchases made with that card."
    }
  ],
  target: [
    {
      question: "How do Target gift cards work?",
      answer: "Target gift cards can be used to purchase items at Target stores, on Target.com, and through the Target app. The card balance is deducted from your purchase total at checkout."
    },
    {
      question: "Where can you use a Target gift card?",
      answer: "Target gift cards can be used at all Target stores nationwide, on Target.com, and in the Target mobile app."
    },
    {
      question: "How to redeem a Target gift card online?",
      answer: "During checkout on Target.com, select 'Add GiftCard' under payment methods, enter your gift card number and access code, and click 'Apply'."
    },
    {
      question: "How to check Target gift card balance?",
      answer: "Check your balance on Target.com/checkgiftcard, call 1-800-544-2943, or ask a team member at any Target store."
    },
    {
      question: "Can Target gift cards be used to buy other gift cards?",
      answer: "Target gift cards generally cannot be used to purchase other gift cards, prepaid cards, or Target GiftCard reloads."
    },
    {
      question: "Do Target gift cards expire?",
      answer: "No, Target gift cards never expire and have no fees. Your balance remains available indefinitely."
    },
    {
      question: "Can Target gift cards be reloaded?",
      answer: "Target gift cards are not reloadable. Once the balance is used, you can purchase a new gift card."
    }
  ],
  airbnb: [
    {
      question: "How do Airbnb gift cards work?",
      answer: "Airbnb gift cards can be redeemed for credit that applies to future Airbnb bookings, including homes, experiences, and more. The credit is added to your Airbnb account."
    },
    {
      question: "Where can you use an Airbnb gift card?",
      answer: "Airbnb gift cards can be used on Airbnb.com or in the Airbnb app for bookings worldwide, subject to the terms and conditions."
    },
    {
      question: "How to redeem an Airbnb gift card?",
      answer: "Go to airbnb.com/redeem, sign in to your account, enter the gift card code, and click 'Redeem'. The credit will be added to your account balance."
    },
    {
      question: "How to check Airbnb gift card balance?",
      answer: "Sign in to your Airbnb account and go to 'Payment & payouts' in your account settings to view your available gift card credit."
    },
    {
      question: "Can Airbnb gift cards be used for experiences?",
      answer: "Yes, Airbnb gift cards can be used for both accommodation bookings and Airbnb Experiences."
    },
    {
      question: "Do Airbnb gift cards expire?",
      answer: "Airbnb gift cards typically have an expiration date, which is stated on the card or in the terms. Check your specific card for details."
    },
    {
      question: "Can I combine multiple Airbnb gift cards?",
      answer: "Yes, you can redeem multiple Airbnb gift cards to your account, and the credits will combine for use on bookings."
    }
  ],
  nike: [
    {
      question: "How do Nike gift cards work?",
      answer: "Nike gift cards can be used to purchase Nike products at Nike retail stores, Nike.com, and the Nike app. The card value is deducted from your purchase total."
    },
    {
      question: "Where can you use a Nike gift card?",
      answer: "Nike gift cards are valid at Nike-owned retail stores in the US, Nike.com, and the Nike mobile app."
    },
    {
      question: "How to redeem a Nike gift card online?",
      answer: "During checkout on Nike.com, select 'Add a gift card' under payment options, enter your gift card number and PIN, and click 'Apply'."
    },
    {
      question: "How to check Nike gift card balance?",
      answer: "Check your balance at Nike.com/help under 'Gift Cards', call Nike customer service at 1-800-806-6453, or ask at any Nike store."
    },
    {
      question: "Can Nike gift cards be used at Nike outlet stores?",
      answer: "Yes, Nike gift cards can be used at Nike outlet stores, Nike retail stores, and online."
    },
    {
      question: "Do Nike gift cards expire?",
      answer: "Nike gift cards typically do not expire and have no fees, but check your specific card terms for details."
    },
    {
      question: "Can I return items purchased with a Nike gift card?",
      answer: "Yes, returns for items purchased with a gift card will be refunded back to a Nike gift card."
    }
  ],
  uber: [
    {
      question: "How do Uber gift cards work?",
      answer: "Uber gift cards add credit to your Uber account that can be used for Uber rides and Uber Eats orders. The credit is automatically applied to your next trip or order."
    },
    {
      question: "Can Uber gift cards be used for Uber Eats?",
      answer: "Yes, Uber gift cards can be used for both Uber rides and Uber Eats food delivery orders."
    },
    {
      question: "How to redeem an Uber gift card?",
      answer: "Open the Uber app, go to 'Payment' in the menu, select 'Add payment method', choose 'Gift card', enter the code, and tap 'Add'."
    },
    {
      question: "How to check Uber gift card balance?",
      answer: "In the Uber app, go to 'Payment' in the menu to view your Uber Cash balance, which includes redeemed gift cards."
    },
    {
      question: "Do Uber gift cards expire?",
      answer: "Uber gift cards and credits typically do not expire, but check the specific terms on your card."
    },
    {
      question: "Can Uber gift cards be transferred?",
      answer: "No, once an Uber gift card is redeemed to an account, the credit cannot be transferred to another account."
    },
    {
      question: "Can I use Uber gift cards internationally?",
      answer: "Uber gift cards purchased in one country may have restrictions on use in other countries. Check the terms for your specific card."
    }
  ],
  visa: [
    {
      question: "How do Visa gift cards work?",
      answer: "Visa gift cards are prepaid cards that work like debit cards. They can be used anywhere Visa is accepted, up to the available balance on the card."
    },
    {
      question: "Where can you use a Visa gift card?",
      answer: "Visa gift cards can be used at millions of locations worldwide that accept Visa debit cards, both online and in-store."
    },
    {
      question: "How to activate a Visa gift card?",
      answer: "Most Visa gift cards are activated at purchase. Some may require activation by calling the number on the sticker or visiting the website provided."
    },
    {
      question: "How to check Visa gift card balance?",
      answer: "Check your balance by visiting the website or calling the phone number printed on the back of your Visa gift card."
    },
    {
      question: "Can Visa gift cards be used online?",
      answer: "Yes, Visa gift cards can be used for online purchases wherever Visa debit cards are accepted. You may need to register the card first."
    },
    {
      question: "Do Visa gift cards expire?",
      answer: "The card itself may have an expiration date, but the funds typically don't expire. Some cards may have monthly maintenance fees after a certain period."
    },
    {
      question: "What if my Visa gift card doesn't cover my full purchase?",
      answer: "You can use your Visa gift card for partial payment and pay the remaining balance with another payment method."
    }
  ],
  roblox: [
    {
      question: "How do Roblox gift cards work?",
      answer: "Roblox gift cards provide credit that can be redeemed for Robux (Roblox's virtual currency) or a Roblox Premium subscription."
    },
    {
      question: "Where can you use Roblox gift cards?",
      answer: "Roblox gift cards can be redeemed on Roblox.com or through the Roblox mobile app to add credit to your Roblox account."
    },
    {
      question: "How to redeem a Roblox gift card?",
      answer: "Go to Roblox.com/redeem, sign in to your account, enter the PIN code from your gift card, and click 'Redeem'."
    },
    {
      question: "How to check Roblox gift card balance?",
      answer: "Once redeemed, check your Robux balance in the top right corner of the Roblox website or app. For unredeemed cards, the full value is on the card."
    },
    {
      question: "Can Roblox gift cards be used for Premium?",
      answer: "Yes, Roblox gift cards can be used to purchase Robux or subscribe to Roblox Premium."
    },
    {
      question: "Do Roblox gift cards expire?",
      answer: "Roblox gift cards typically do not expire. Once redeemed, the credit remains in your account."
    },
    {
      question: "Can I redeem Roblox gift cards from other countries?",
      answer: "Roblox gift cards are typically region-specific. Make sure to purchase a card that's valid in your country."
    }
  ],
  playstation: [
    {
      question: "How do PlayStation gift cards work?",
      answer: "PlayStation gift cards add funds to your PlayStation Network wallet, which can be used to purchase games, DLC, subscriptions, and other content from the PlayStation Store."
    },
    {
      question: "Where can you use PlayStation gift cards?",
      answer: "PlayStation gift cards can be redeemed on PlayStation consoles (PS4, PS5), the PlayStation app, or the PlayStation website."
    },
    {
      question: "How to redeem a PlayStation gift card?",
      answer: "On your console, go to PlayStation Store, select your profile, choose 'Redeem Codes', enter the code, and select 'Redeem'."
    },
    {
      question: "How to check PlayStation wallet balance?",
      answer: "Check your wallet balance in Settings > Users and Accounts > Account > Payment and Subscriptions > Add Funds on your PlayStation console."
    },
    {
      question: "Can PlayStation gift cards be used for PS Plus?",
      answer: "Yes, funds from PlayStation gift cards can be used to purchase PlayStation Plus subscriptions and other services."
    },
    {
      question: "Do PlayStation gift cards expire?",
      answer: "PlayStation gift cards and the funds in your wallet typically do not expire."
    },
    {
      question: "Are PlayStation gift cards region-locked?",
      answer: "Yes, PlayStation gift cards are region-specific and must match the region of your PlayStation account."
    }
  ],
  xbox: [
    {
      question: "How do Xbox gift cards work?",
      answer: "Xbox gift cards add credit to your Microsoft account that can be used for games, apps, movies, Xbox Game Pass, and other content on Xbox and Windows."
    },
    {
      question: "Where can you use Xbox gift cards?",
      answer: "Xbox gift cards can be used on Xbox consoles, Windows PCs, and the Microsoft Store for digital content."
    },
    {
      question: "How to redeem an Xbox gift card?",
      answer: "On your Xbox, press the Xbox button, go to Store > Redeem, enter the 25-character code, and select 'Redeem'."
    },
    {
      question: "How to check Xbox account balance?",
      answer: "Check your balance by going to account.microsoft.com/billing, or in the Microsoft Store under your profile."
    },
    {
      question: "Can Xbox gift cards be used for Game Pass?",
      answer: "Yes, Xbox gift cards can be used to purchase Xbox Game Pass subscriptions and other Microsoft services."
    },
    {
      question: "Do Xbox gift cards expire?",
      answer: "Xbox gift cards and account balances typically do not expire, but check the specific terms on your card."
    },
    {
      question: "Can I use Xbox gift cards on Windows?",
      answer: "Yes, Xbox gift cards add credit to your Microsoft account, which can be used across Xbox and Windows devices."
    }
  ],
  google: [
    {
      question: "How do Google Play gift cards work?",
      answer: "Google Play gift cards add credit to your Google Play balance, which can be used for apps, games, movies, books, and subscriptions."
    },
    {
      question: "Where can you use Google Play gift cards?",
      answer: "Google Play gift cards can be used in the Google Play Store on Android devices and on play.google.com."
    },
    {
      question: "How to redeem a Google Play gift card?",
      answer: "Open the Google Play Store app, tap the menu icon, select 'Redeem', enter the code, and tap 'Redeem'."
    },
    {
      question: "How to check Google Play balance?",
      answer: "In the Google Play Store app, tap the menu icon and view your balance under 'Payment methods'."
    },
    {
      question: "Can Google Play gift cards be used for in-app purchases?",
      answer: "Yes, Google Play credit can be used for in-app purchases, game content, and app subscriptions."
    },
    {
      question: "Do Google Play gift cards expire?",
      answer: "Google Play gift cards and balances typically do not expire."
    },
    {
      question: "Can Google Play gift cards be transferred?",
      answer: "No, once a Google Play gift card is redeemed to an account, the credit cannot be transferred."
    }
  ],
  "barnes-and-noble": [
    {
      question: "How do Barnes & Noble gift cards work?",
      answer: "Barnes & Noble gift cards can be used to purchase books, e-books, magazines, toys, games, and café items at Barnes & Noble stores and online."
    },
    {
      question: "Where can you use a Barnes & Noble gift card?",
      answer: "Barnes & Noble gift cards are valid at all B&N retail stores, BN.com, and Barnes & Noble cafés."
    },
    {
      question: "How to redeem a Barnes & Noble gift card online?",
      answer: "During checkout on BN.com, enter your gift card number and PIN under 'Payment Options'."
    },
    {
      question: "How to check Barnes & Noble gift card balance?",
      answer: "Check your balance at BarnesandNoble.com/gc, by calling 1-800-THE-BOOK, or at any B&N store."
    },
    {
      question: "Can Barnes & Noble gift cards be used for NOOK books?",
      answer: "Yes, Barnes & Noble gift cards can be used to purchase NOOK books and other digital content."
    },
    {
      question: "Do Barnes & Noble gift cards expire?",
      answer: "Barnes & Noble gift cards do not expire and have no fees."
    },
    {
      question: "Can I use multiple gift cards on one purchase?",
      answer: "Yes, you can use multiple Barnes & Noble gift cards for a single purchase both in-store and online."
    }
  ],
  "bath-and-body-works": [
    {
      question: "How do Bath & Body Works gift cards work?",
      answer: "Bath & Body Works gift cards can be used to purchase products at Bath & Body Works and White Barn stores, as well as online."
    },
    {
      question: "Where can you use Bath & Body Works gift cards?",
      answer: "Bath & Body Works gift cards are valid at Bath & Body Works stores, White Barn stores, and online at BathandBodyWorks.com."
    },
    {
      question: "How to use a Bath & Body Works gift card online?",
      answer: "During checkout, enter your gift card number and PIN under 'Payment' to apply the balance."
    },
    {
      question: "How to check Bath & Body Works gift card balance?",
      answer: "Check your balance at BathandBodyWorks.com/gift-cards, by calling 1-877-832-9272, or at any store."
    },
    {
      question: "Can Bath & Body Works gift cards be reloaded?",
      answer: "No, Bath & Body Works gift cards cannot be reloaded."
    },
    {
      question: "Do Bath & Body Works gift cards expire?",
      answer: "Bath & Body Works gift cards do not expire and have no dormancy fees."
    },
    {
      question: "Can I return items purchased with a gift card?",
      answer: "Yes, returns for items purchased with a gift card will be refunded back to a gift card."
    }
  ],
  chipotle: [
    {
      question: "How do Chipotle gift cards work?",
      answer: "Chipotle gift cards can be used to purchase food and beverages at Chipotle Mexican Grill restaurants and online orders."
    },
    {
      question: "Where can you use a Chipotle gift card?",
      answer: "Chipotle gift cards are valid at all Chipotle locations in the US and can be used for online orders through Chipotle.com or the app."
    },
    {
      question: "How to use a Chipotle gift card for online orders?",
      answer: "When checking out online or in the app, select 'Gift Card' as your payment method and enter the card number and PIN."
    },
    {
      question: "How to check Chipotle gift card balance?",
      answer: "Check your balance at Chipotle.com/card-balance, call 1-877-925-4878, or ask at any Chipotle restaurant."
    },
    {
      question: "Can Chipotle gift cards be reloaded?",
      answer: "No, Chipotle gift cards are not reloadable."
    },
    {
      question: "Do Chipotle gift cards expire?",
      answer: "Chipotle gift cards do not expire and have no fees."
    },
    {
      question: "Can I use multiple Chipotle gift cards in one transaction?",
      answer: "You may be able to use multiple gift cards, but it's best to check with the restaurant or online checkout system."
    }
  ],
  cvs: [
    {
      question: "How do CVS gift cards work?",
      answer: "CVS gift cards can be used to purchase products at CVS Pharmacy stores, including prescriptions, health items, beauty products, and more."
    },
    {
      question: "Where can you use CVS gift cards?",
      answer: "CVS gift cards are valid at all CVS Pharmacy locations in the US."
    },
    {
      question: "Can CVS gift cards be used online?",
      answer: "CVS gift cards can generally be used for online purchases at CVS.com, subject to the terms and conditions."
    },
    {
      question: "How to check CVS gift card balance?",
      answer: "Check your balance at CVS.com/giftcards, call 1-877-295-7777, or ask at any CVS store."
    },
    {
      question: "Can CVS gift cards be used for prescriptions?",
      answer: "Yes, CVS gift cards can be used to pay for prescriptions and other pharmacy services."
    },
    {
      question: "Do CVS gift cards expire?",
      answer: "CVS gift cards typically do not expire, but check your card terms for specific details."
    },
    {
      question: "Can I reload a CVS gift card?",
      answer: "CVS gift cards are generally not reloadable."
    }
  ],
  "dicks-sporting-goods": [
    {
      question: "How do Dick's Sporting Goods gift cards work?",
      answer: "Dick's Sporting Goods gift cards can be used to purchase sporting goods, apparel, footwear, and equipment at Dick's stores and online."
    },
    {
      question: "Where can you use Dick's Sporting Goods gift cards?",
      answer: "Dick's gift cards are valid at Dick's Sporting Goods stores, Golf Galaxy stores, and online at DicksSportingGoods.com."
    },
    {
      question: "How to use a Dick's gift card online?",
      answer: "During checkout on DicksSportingGoods.com, enter your gift card number and PIN under 'Payment Options'."
    },
    {
      question: "How to check Dick's Sporting Goods gift card balance?",
      answer: "Check your balance at DicksSportingGoods.com/giftcards, call 1-877-846-9997, or ask at any Dick's store."
    },
    {
      question: "Can Dick's gift cards be used at Golf Galaxy?",
      answer: "Yes, Dick's Sporting Goods gift cards can be used at Golf Galaxy stores and online."
    },
    {
      question: "Do Dick's Sporting Goods gift cards expire?",
      answer: "Dick's gift cards do not expire and have no fees."
    },
    {
      question: "Can I combine multiple gift cards?",
      answer: "Yes, you can use multiple Dick's gift cards for a single purchase."
    }
  ],
  dunkin: [
    {
      question: "How do Dunkin' gift cards work?",
      answer: "Dunkin' gift cards can be loaded with funds and used to purchase beverages, food, and merchandise at participating Dunkin' locations."
    },
    {
      question: "Where can you use Dunkin' gift cards?",
      answer: "Dunkin' gift cards are valid at participating Dunkin' locations in the US and can be used through the Dunkin' app."
    },
    {
      question: "How to reload a Dunkin' gift card?",
      answer: "Reload your Dunkin' card through the Dunkin' app, at DunkinDonuts.com, or at any participating Dunkin' location."
    },
    {
      question: "How to check Dunkin' gift card balance?",
      answer: "Check your balance in the Dunkin' app, at DunkinDonuts.com, or ask at any Dunkin' location."
    },
    {
      question: "Can Dunkin' gift cards earn rewards?",
      answer: "Yes, when you register your Dunkin' card with DD Perks Rewards, you can earn points on purchases."
    },
    {
      question: "Do Dunkin' gift cards expire?",
      answer: "Dunkin' gift cards do not expire."
    },
    {
      question: "Can I transfer my Dunkin' gift card balance?",
      answer: "You may be able to transfer balances between registered cards through the Dunkin' app or website."
    }
  ],
  gamestop: [
    {
      question: "How do GameStop gift cards work?",
      answer: "GameStop gift cards can be used to purchase video games, consoles, accessories, collectibles, and more at GameStop stores and online."
    },
    {
      question: "Where can you use GameStop gift cards?",
      answer: "GameStop gift cards are valid at all GameStop stores in the US and on GameStop.com."
    },
    {
      question: "How to use a GameStop gift card online?",
      answer: "During checkout on GameStop.com, select 'Gift Card' as your payment method and enter the card number and PIN."
    },
    {
      question: "How to check GameStop gift card balance?",
      answer: "Check your balance at GameStop.com/giftcardbalance, call 1-800-883-8895, or ask at any GameStop store."
    },
    {
      question: "Can GameStop gift cards be used for digital purchases?",
      answer: "Yes, GameStop gift cards can be used for digital game codes and other digital content sold by GameStop."
    },
    {
      question: "Do GameStop gift cards expire?",
      answer: "GameStop gift cards do not expire and have no fees."
    },
    {
      question: "Can I use a GameStop gift card for trade-ins?",
      answer: "GameStop gift cards are for purchases only. Trade-ins result in store credit, which is separate."
    }
  ],
  "old-navy": [
    {
      question: "How do Old Navy gift cards work?",
      answer: "Old Navy gift cards can be used to purchase clothing, accessories, and other merchandise at Old Navy stores and online."
    },
    {
      question: "Can Old Navy gift cards be used at Gap or Banana Republic?",
      answer: "Yes, Old Navy gift cards can typically be used at Gap, Banana Republic, and Athleta stores as they're part of the same parent company."
    },
    {
      question: "How to use an Old Navy gift card online?",
      answer: "During checkout on OldNavy.com, enter your gift card number and PIN under 'Payment Options'."
    },
    {
      question: "How to check Old Navy gift card balance?",
      answer: "Check your balance at OldNavy.com, call 1-800-OLD-NAVY, or ask at any Old Navy store."
    },
    {
      question: "Can Old Navy gift cards be reloaded?",
      answer: "Old Navy gift cards are not reloadable."
    },
    {
      question: "Do Old Navy gift cards expire?",
      answer: "Old Navy gift cards do not expire and have no fees."
    },
    {
      question: "Can I return items purchased with an Old Navy gift card?",
      answer: "Yes, returns for items purchased with a gift card will be refunded back to a gift card."
    }
  ],
  panera: [
    {
      question: "How do Panera gift cards work?",
      answer: "Panera gift cards can be used to purchase food, beverages, and bakery items at Panera Bread locations and for online orders."
    },
    {
      question: "Where can you use Panera gift cards?",
      answer: "Panera gift cards are valid at all Panera Bread bakery-cafés in the US and can be used for online orders."
    },
    {
      question: "How to use a Panera gift card for online orders?",
      answer: "When ordering online or through the Panera app, select 'Gift Card' as your payment method and enter the card number."
    },
    {
      question: "How to check Panera gift card balance?",
      answer: "Check your balance at PaneraBread.com/giftcards, call 1-877-726-3721, or ask at any Panera location."
    },
    {
      question: "Can Panera gift cards be reloaded?",
      answer: "Panera gift cards are typically not reloadable, but you can add them to your MyPanera account."
    },
    {
      question: "Do Panera gift cards expire?",
      answer: "Panera gift cards do not expire."
    },
    {
      question: "Can I earn MyPanera rewards with a gift card?",
      answer: "Yes, when you add your gift card to your MyPanera account, you can still earn rewards on purchases."
    }
  ],
  "papa-johns": [
    {
      question: "How do Papa John's gift cards work?",
      answer: "Papa John's gift cards can be used to purchase pizza, sides, desserts, and beverages at Papa John's locations and for online orders."
    },
    {
      question: "Where can you use Papa John's gift cards?",
      answer: "Papa John's gift cards are valid at participating Papa John's locations in the US and for online orders at PapaJohns.com."
    },
    {
      question: "How to use a Papa John's gift card online?",
      answer: "When ordering online, select 'Gift Card' as your payment method and enter the card number and PIN during checkout."
    },
    {
      question: "How to check Papa John's gift card balance?",
      answer: "Check your balance at PapaJohns.com/giftcards or call Papa John's customer service."
    },
    {
      question: "Can Papa John's gift cards be reloaded?",
      answer: "Papa John's gift cards are typically not reloadable."
    },
    {
      question: "Do Papa John's gift cards expire?",
      answer: "Papa John's gift cards generally do not expire, but check your card terms."
    },
    {
      question: "Can I use a Papa John's gift card with other promotions?",
      answer: "Yes, Papa John's gift cards can typically be combined with other offers and promotions."
    }
  ],
  ulta: [
    {
      question: "How do Ulta gift cards work?",
      answer: "Ulta gift cards can be used to purchase beauty products, cosmetics, skincare, haircare, and salon services at Ulta Beauty stores and online."
    },
    {
      question: "Where can you use Ulta gift cards?",
      answer: "Ulta gift cards are valid at all Ulta Beauty stores in the US and on Ulta.com."
    },
    {
      question: "How to use an Ulta gift card online?",
      answer: "During checkout on Ulta.com, enter your gift card number and PIN under 'Payment Options'."
    },
    {
      question: "How to check Ulta gift card balance?",
      answer: "Check your balance at Ulta.com/giftcards, call 1-866-983-8582, or ask at any Ulta Beauty store."
    },
    {
      question: "Can Ulta gift cards be used for salon services?",
      answer: "Yes, Ulta gift cards can be used for salon services, including haircuts, color, and treatments."
    },
    {
      question: "Do Ulta gift cards expire?",
      answer: "Ulta gift cards do not expire and have no fees."
    },
    {
      question: "Can I earn Ultamate Rewards with a gift card?",
      answer: "Yes, when linked to your Ultamate Rewards account, you can still earn points on purchases made with gift cards."
    }
  ]
}

export default function RewardItemFAQ({ brandName }: RewardItemFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const brandKey = brandName.toLowerCase().replace(/\s+/g, "-")
  const faqs = brandFAQs[brandKey] || brandFAQs.amazon // Fallback to Amazon FAQs

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 text-center mb-4 md:mb-6">
          {brandName} gift card FAQs
        </h2>

        {/* FAQ Items */}
        <div className="space-y-4 mt-8 md:mt-12">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-200 last:border-b-0"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full py-5 md:py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors px-4 rounded-lg"
              >
                <span className="text-lg sm:text-xl font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <div className="flex-shrink-0">
                  <svg
                    className={`w-6 h-6 text-gray-600 transform transition-transform duration-200 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              {openIndex === index && (
                <div className="px-4 pb-6 text-base sm:text-lg text-gray-700 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
