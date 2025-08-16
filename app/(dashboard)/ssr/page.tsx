// app/page.tsx
import ClientComponent from "../ClientComponents";

async function getServerSideData() {
  // Simulate fetching the theme from a server or API
  return "dark"; // Example value
}

// Server component
export default async function Home() {
  const initialTheme = await getServerSideData(); // SSR logic
  return (
    <div>
      Server component
      <ClientComponent initialTheme={initialTheme} />
    </div>
  );
}
