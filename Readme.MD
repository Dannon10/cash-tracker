# Cash Tracker

A modern, AI-powered personal finance app built with React Native and Expo. Track your income and expenses, visualize spending patterns, and log transactions hands-free using your voice.

---

## Demo

<!-- Add your screen recording below -->
> 🎥 **[Watch Demo Video](https://github.com/user-attachments/assets/36a4eba6-4718-4d85-8fe6-5c970f9ad0ea)**  
> *(Replace this with your actual video link or embed once uploaded)*

---

## Features

- **Dashboard** — Real-time balance card showing total income, total expenses, and net balance at a glance
- **Transaction Management** — Add, edit, and delete income/expense transactions with categories, amounts, and dates
- **Voice Input** — Log transactions hands-free using AI-powered voice recognition powered by Groq
- **Reports & Analytics** — Visual breakdown of spending by category with pie charts, monthly trends, and key insights like daily average spend and biggest expense
- **Authentication** — Secure email/password sign up and login with session persistence
- **Onboarding** — First-time user onboarding flow before reaching the main app
- **Dark & Light Mode** — Full theme support that persists across sessions
- **Error Boundaries** — Graceful error handling so crashes don't take down the whole app

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Expo](https://expo.dev) (SDK 53) + [React Native](https://reactnative.dev) |
| Navigation | [Expo Router](https://expo.github.io/router) (file-based routing) |
| Backend & Database | [Supabase](https://supabase.com) (PostgreSQL + Auth) |
| AI / Voice | [Groq API](https://groq.com) (speech-to-text + natural language parsing) |
| State Management | [Zustand](https://zustand-demo.pmnd.rs) |
| Styling | [twrnc](https://github.com/jaredh159/twrnc) (Tailwind for React Native) |
| Charts | [react-native-gifted-charts](https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts) |
| Animations | [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) |
| Gestures | [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) |
| Testing | [Jest](https://jestjs.io) + [jest-expo](https://github.com/expo/expo/tree/main/packages/jest-expo) + [Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/) |
| Language | TypeScript |

---

## Project Structure

```
cashtracker/
├── app/                    # Expo Router file-based routes
│   ├── _layout.tsx         # Root layout + auth guard
│   ├── index.tsx           # Onboarding / welcome screen
│   ├── auth/               # Login & signup screens
│   ├── (tabs)/             # Main app tabs
│   │   ├── transactions.tsx # Dashboard screen
│   │   ├── reports.tsx     # Reports & analytics screen
│   │   └── _layout.tsx     # Tab bar layout
│   └── settings/           # Settings screen
├── components/             # Reusable UI components
├── store/                  # Zustand global state
│   ├── useAuthStore.ts     # Auth state (user, session, sign in/out)
│   ├── useTransactionStore.ts # Transactions CRUD + computed values
│   └── useThemeStore.ts    # Dark/light theme
├── utils/                  # Pure utility functions
├── types/                  # TypeScript interfaces
├── lib/                    # Supabase client setup
└── __tests__/              # Jest test suites
```

---

## Authentication Flow

1. App launches → `initialize()` fetches existing Supabase session
2. **No session** → User is directed to onboarding (first time) or login
3. **Session exists** → User is redirected directly to the Dashboard
4. Login / Sign up via Supabase Auth (email + password)
5. On sign out → session cleared, user redirected to login
6. Auth state changes (e.g. token expiry) are handled automatically via `onAuthStateChange`

---

## Voice Input (Groq AI)

1. User taps the microphone button in the Add Transaction modal
2. Audio is recorded and sent to the **Groq API** for transcription
3. The transcribed text is parsed to extract transaction details (amount, category, type, title)
4. Fields are auto-filled in the form — user reviews and confirms

---

## Reports

The Reports screen provides a full financial overview:

- **Summary Cards** — Total income vs total expenses side by side
- **Net Balance Card** — Overall financial health at a glance
- **Category Donut Chart** — Spending breakdown by category with percentages
- **Insights** — Daily average spend, biggest single expense, and month-over-month comparison
- **Monthly Trend Bar Chart** — Income vs expenses grouped by month

---

## Testing

The project has **33 tests across 7 test suites** covering all critical business logic:

```bash
npx jest --colors --runInBand
```

| Suite | Coverage |
|---|---|
| `useTransactionStore` | CRUD operations, balance/income/expense calculations, error handling |
| `useAuthStore` | Initialize, sign in, sign up, sign out, auth state changes |
| `useThemeStore` | Theme toggle and AsyncStorage persistence |
| `RootLayout` | Auth-based navigation redirects |
| `ErrorBoundary` | Render error catching |
| `tabsError` | Tab-level error UI |
| `StyledText` | Component snapshot |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo Go app on your phone, or an Android/iOS simulator
- A Supabase project
- A Groq API key

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/cashtracker.git
cd cashtracker

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GROQ_API_KEY=your_groq_api_key
```

### Supabase Setup

Create a `transactions` table in your Supabase project:

```sql
create table transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  amount numeric not null,
  date date not null,
  category text not null,
  type text check (type in ('income', 'expense')) not null,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table transactions enable row level security;

create policy "Users can only access their own transactions"
  on transactions for all
  using (auth.uid() = user_id);
```

### Running the App

```bash
npx expo start
```

Then scan the QR code with Expo Go, or press `a` for Android / `i` for iOS simulator.

---

## 📄 License

MIT © 2026
