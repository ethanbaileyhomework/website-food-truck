import { AdminApp } from "@/components/admin/AdminApp";
import { AdminGuide } from "@/components/admin/AdminGuide";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Admin() {
  return (
    <main className="min-h-screen bg-slate-950">
      <AdminGuide />
      <div className="min-h-[70vh]">
        <AdminApp />
      </div>
    </main>
  );
}
