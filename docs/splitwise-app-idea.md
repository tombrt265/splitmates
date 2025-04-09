<h1>"Splitwise" - The App</h1>

<h3>The prompt for ChatGPT</h3>

```md
i'd like to make a web application then with a friend. i will describe the app:
imagine you are on vacation with a bunch of friends and you go grocery shopping.
one of the friends is paying for everyone.
on another day another friend is paying. to know who to pay back at the end of the vacation is tedious.
the app should solve that problem by calculating automatically what everyone in the friend group has to pay.
the concept is, that you can make a group of the friends. then you can select who has to pay what charges.
ideally there should be a way to automatically pay using paypal or such.
```

----
<br>

### 🧱 Core Features

1. **Create a Group**  
   - Name of the trip (e.g., "Italy 2025")
   - Add/remove friends by name or email

2. **Add an Expense**
   - Who paid?
   - Total amount?
   - Description (e.g., “groceries”)
   - Who was involved (split among whom)? Equally or custom amounts?

3. **Calculate Balances**
   - Show who owes whom and how much
   - Optional: simplify debts so it’s fewer transactions

4. **Settle Up**
   - Option to mark debts as paid
   - Bonus: Link with **PayPal**, **Venmo**, etc. (via APIs)

---

### 🧰 Suggested Tech Stack (Beginner-Friendly)

**Frontend (UI):**
- HTML/CSS + JavaScript
- Use a framework like **React** (lots of tutorials and flexibility)

**Backend (optional for now):**
- Firebase (Authentication + Realtime Database/Firestore) – great for beginners!
- Or a simple Node.js + Express server with MongoDB

**Authentication:**
- Sign up / log in (could use Firebase Auth for easy integration)

**Payments (optional / advanced):**
- PayPal API or Stripe (can be added later)

---

### 🧪 MVP First (Minimum Viable Product)

Start with:
- [x] Create group
- [x] Add expenses
- [x] Split expenses and calculate balances

Once that’s smooth, then add:
- [ ] Settling up
- [ ] Payment integrations
- [ ] Fancy UI/UX


----
<br>
<br>

## 🌱 Step-by-Step Instructions (MVP)

### 1. ✅ Install Prerequisites
Make sure you and your friend have these installed:

- [Node.js & npm](https://nodejs.org/)
- A code editor (e.g. [VS Code](https://code.visualstudio.com/))
- Git (optional but great for collaboration)

---

### 2. 🔧 Create a New React App

```bash
npx create-react-app vacation-expense-tracker
cd vacation-expense-tracker
npm start
```

You now have a working local web app.

---

### 3. 🔥 Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add Project**, name it something like *Vacation Tracker*
3. Add a **Web App** to your project
4. Copy the Firebase config (you'll paste this into your React app)
5. In the Firebase console:
   - Go to **Firestore Database** → Create a database (start in test mode)
   - Go to **Authentication** → Enable **Email/Password** sign-in

---

### 4. 📦 Install Firebase in Your Project

```bash
npm install firebase
```

Then in your project, create a file:  
`src/firebase.js`

```js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // paste your config here
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

---

### 5. 📋 Plan Your Data Structure (Firestore)

```plaintext
/groups/{groupId}
  - name: "Italy Trip"
  - members: [uid1, uid2, ...]

/groups/{groupId}/expenses/{expenseId}
  - amount: 50
  - paidBy: uid1
  - description: "Groceries"
  - splitBetween: [uid1, uid2, uid3]

/users/{userId}
  - email
  - displayName
```

---

### 6. 🧱 Build the UI (React)

Break the app into components like:
- `LoginPage.js` (authentication)
- `Dashboard.js` (list of groups)
- `GroupPage.js` (expenses + balances)
- `AddExpenseForm.js`

Use Firebase Auth to handle sign-in, and Firestore to store/retrieve data.

---

### 7. 🔁 Expense Logic (Basic Version)

When a user adds an expense:
1. Save it in Firestore
2. Recalculate balances:
   - Each user owes `(amount / num of people)` to the one who paid

Later, you can:
- Auto-simplify debts
- Show who pays whom the least amount of times

---

### 8. ☁️ Optional: Deploy It Online

Once you're happy with the MVP:
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

Your app is now live on the web 🌐

---

### ✅ Summary: What You’ll Use

| Purpose             | Tool                      |
|---------------------|---------------------------|
| UI Framework        | React                     |
| Backend + Database  | Firebase (Firestore)      |
| Auth                | Firebase Auth             |
| Deployment          | Firebase Hosting          |
| Payment Integration | (Later) PayPal API        |


----
<br>
<br>

## 🧭 Vacation Expense Tracker – Beginner-Friendly Workflow

---

### ✅ **PHASE 1: Planning (Day 1)**

1. **Define the MVP (Minimum Viable Product)**  
   - Create group
   - Add friends
   - Add expenses
   - Split amount among selected friends
   - Show balances

2. **Decide Your Tools**
   - Frontend: React (with create-react-app)
   - Backend/Database: Firebase (Firestore + Auth)
   - Deployment: Firebase Hosting

3. **Set Up GitHub Repository**
   - Create a repo for version control and collaboration

---

### 🔧 **PHASE 2: Setup & Environment (Day 2)**

1. Install Node.js, VS Code, Git  
2. `npx create-react-app vacation-expense-tracker`  
3. Setup Firebase project in [console.firebase.google.com](https://console.firebase.google.com)
4. Connect Firebase to your app (`firebase.js` setup)
5. Setup Firebase Hosting (later)

---

### 🛠️ **PHASE 3: Authentication System (Day 3-4)**

1. Enable **Email/Password** login in Firebase Auth
2. Create login & signup forms in React
3. Store user data in Firestore (`users` collection)
4. Use Firebase `onAuthStateChanged()` to detect if logged in

✅ You now have a working login system.

---

### 🧱 **PHASE 4: Core App Structure (Day 5–7)**

Break the app into **screens** or **pages**:

| Page | Purpose |
|------|---------|
| `Dashboard` | List of user’s groups |
| `GroupPage` | List of expenses, add expense, see balances |
| `AddExpensePage` | Form to add new expense |

Set up **React Router** for page navigation:
```bash
npm install react-router-dom
```

---

### 📊 **PHASE 5: Add Group & Expense Functionality (Week 2)**

1. **Create Group**
   - Create group document in Firestore
   - Add members by email or ID

2. **Add Expense**
   - Select payer
   - Input total amount
   - Select involved friends
   - Save to `/groups/{groupId}/expenses/`

3. **Calculate Who Owes What**
   - Create a helper function that calculates:
     - how much each person owes
     - to whom

4. **Display Balances**
   - On `GroupPage`, show summary like:
     ```
     Alex owes Dana: $10  
     Dana owes Max: $5
     ```

---

### 💅 **PHASE 6: Styling and UI Polish (Week 3)**

Use a CSS framework like:
```bash
npm install tailwindcss
```
or go with simple CSS modules. Add:
- Color themes
- Responsive layout
- Friendly buttons and form validation

---

### 🌍 **PHASE 7: Deployment (End of Week 3)**

1. Build project:
   ```bash
   npm run build
   ```
2. Deploy with Firebase Hosting:
   ```bash
   firebase init hosting
   firebase deploy
   ```

---

### 🌟 **BONUS FEATURES (Optional/Stretch Goals)**

- Settle up & mark expenses as paid
- Add PayPal integration
- Add avatars or profile pictures
- Create a mobile-friendly layout
- Add dark mode

---

### 🧑‍🤝‍🧑 Suggested Team Workflow

| Task | Person A | Person B |
|------|----------|----------|
| Auth + Firebase Setup | ✅ | |
| UI Components | | ✅ |
| Routing & Pages | ✅ | |
| Expense Logic | | ✅ |
| Styling | ✅ | ✅ |
| Deployment | ✅ | |


----
<br>
<br>

Here’s a **Notion Board Template** for your Vacation Expense Tracker project. You can copy and paste this into your own Notion workspace to use it as a **Kanban board** (like Trello, but inside Notion).

---

### 🔗 [Click here to duplicate this template in Notion](https://www.notion.so/Vacation-Expense-Tracker-Board-Template-1f3f28cbebca41d4b598c1d34a1a7392?pvs=4)

> If that link doesn't work for you, here’s how to manually create it:

---

## 🧾 How to Create This Board in Notion (Step-by-step)

1. Open Notion → Create a new page  
2. Choose **"Board"** as the layout  
3. Name the page: `Vacation Expense Tracker`  
4. Set up the following **columns** (statuses):
   - `To Do`
   - `In Progress`
   - `Done`
   - `Stretch Goals`

5. Now add **cards** (tasks) under each column:

---

### ✅ To Do

- Set up GitHub repo and invite collaborator  
- Install Node.js, VS Code, Git  
- Create React app using `create-react-app`  
- Set up Firebase project in console  
- Add Firebase SDK & `firebase.js` config  
- Enable Email/Password auth in Firebase  
- Design simple wireframes (paper/Figma)  
- Set up React Router for navigation  
- Create login & signup pages  
- Create Firestore collections: `users`, `groups`, `expenses`

---

### 🔧 In Progress

- Build Firebase authentication logic  
- Build `Dashboard` to list user’s groups  
- Create group form (name + members)  
- Store new group in Firestore  

---

### ✅ Done
_(Move tasks here when completed)_

---

### 🌟 Stretch Goals

- Add expense form (amount, payer, split)  
- Expense calculation logic  
- Show who owes what  
- “Settle up” functionality  
- Use TailwindCSS for styling  
- Deploy with Firebase Hosting  
- PayPal integration  
- Mobile-friendly layout  
- Dark mode

----
<br>
<br>
