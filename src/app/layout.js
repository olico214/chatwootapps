import "./globals.css";
import { Toaster } from "sonner";
const appname = process.env.NAMEAPP || "SOITEG";
export const metadata = {
  title: appname,
  description: appname,
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster richColors position="top-center" />
        {children}
      </body>
    </html>
  );
}
