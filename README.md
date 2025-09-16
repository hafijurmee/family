# Family Contacts — সুন্দর, অ্যানিমেটেড কন্ট্যাক্ট ওয়েবসাইট

**ফিচারসমূহ**

- Header + Footer, সুন্দর গ্রেডিয়েন্ট ও মাইক্রো-অ্যানিমেশন
- মোবাইল-ফার্স্ট রেসপন্সিভ ডিজাইন
- সার্চ, ফিল্টার (Called/Not Called), সোর্ট
- কল করলে স্ট্যাটাস **সবুজ (Called)**, না করলে **লাল (Not Called)**
- Last called সময়, call count (ভিতরে ট্র্যাক হয়), স্ট্যাটাস রিসেট
- লোকালস্টোরেজে ডেটা সেভ হয় (প্রাইভেট)
- থিম টগল: ডার্ক/লাইট
- Import/Export (JSON ব্যাকআপ)
- GitHub Pages-এ ডিপ্লয় উপযোগী **স্ট্যাটিক** সাইট

---

## লোকাল রান

শুধু `index.html` ব্রাউজারে ওপেন করলেই চলবে। (টেলিফোন লিংক `tel:` মোবাইলে কাজ করবে।)

## কনট্যাক্ট কাস্টমাইজ

`/js/app.js` ফাইলে `defaultContacts` অ্যারেতে আপনার পরিবারের সদস্যদের নাম/সম্পর্ক/নম্বর বসিয়ে দিন।
প্রথম লোডে এই ডেটা ইউজ হবে; এরপর যা কিছু যোগ/এডিট করবেন সব ব্রাউজারের লোকালস্টোরেজে সেভ থাকবে।

```js
const defaultContacts = [
  { id: crypto.randomUUID(), name: "আব্বা", relation: "বাবা", phones: ["+8801XXXXXXXXX"], status: "not_called", lastCalled: null, callCount: 0 },
  // ...
];
```

## GitHub Pages এ লাইভ করা

1. এই ফোল্ডারের সব ফাইল একটি নতুন GitHub রিপোতে আপলোড করুন (যেমন: `family-contacts`).
2. GitHub → **Settings** → **Pages** → Source: **Deploy from a branch** → Branch: `main` → Folder: `/ (root)` বা `/docs` (যদি আপনি `/docs` এ রাখেন)।
3. সেভ করুন। কয়েক মুহূর্ত পর আপনার সাইট লাইভ হবে `https://<username>.github.io/family-contacts/` এই ঠিকানায়।

> আপনার ডোমেইনে চালাতে চাইলে (যেমন: `family.hafijur.my.id`) — DNS-এ CNAME সেট করুন এবং রিপোতে `CNAME` ফাইল যোগ করুন যেখানে ডোমেইনটি থাকবে।

## নোট

- Import/Export কেবলমাত্র JSON স্ট্রাকচারের জন্য।
- ডেটা সিকিউরিটির জন্য কোনো সার্ভার নেই—সবকিছু আপনার ব্রাউজারেই থাকে।
- কোডটি সম্পূর্ণ **vanilla HTML/CSS/JS** — কোনো CDN/Framework দরকার নেই।

— Built for Hafijur 💙
