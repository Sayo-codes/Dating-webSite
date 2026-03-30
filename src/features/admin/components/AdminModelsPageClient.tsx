"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { ModelList, type AdminModelRow } from "@/components/Admin/ModelList";
import { CreateModelModal } from "@/components/Admin/CreateModelModal";

type Props = {
  initialModels: AdminModelRow[];
  defaultOpenCreate?: boolean;
};

export function AdminModelsPageClient({ initialModels, defaultOpenCreate = false }: Props) {
  const router = useRouter();
  const [models, setModels] = useState(initialModels);
  const [modalOpen, setModalOpen] = useState(defaultOpenCreate);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" } | null>(null);

  useEffect(() => {
    setModels(initialModels);
  }, [initialModels]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(t);
  }, [toast]);

  const pushToast = (message: string, tone: "success" | "error") => {
    setToast({ message, tone });
  };

  const handleChanged = () => {
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 z-[200] max-w-md -translate-x-1/2 rounded-2xl border px-5 py-3 text-center text-sm font-medium shadow-lg backdrop-blur-md ${
            toast.tone === "success"
              ? "border-[#d4a853]/40 bg-[#0e0c08]/95 text-[#f0c97a]"
              : "border-red-500/40 bg-[#1a0a0c]/95 text-red-200"
          }`}
          role="status"
        >
          {toast.message}
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#f0c97a]/70">Admin ✦</p>
          <h1 className="mt-1 font-[var(--font-heading)] text-2xl font-bold text-white sm:text-3xl">Models & Creators</h1>
          <p className="mt-2 max-w-xl text-sm text-white/50">
            Manage Rsdate talent — create profiles, set verification, and curate imagery. Deletes are permanent.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="focus-outline inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#d4a853] to-[#f0c97a] px-6 py-3 text-sm font-semibold text-[#1a1208] shadow-[0_8px_32px_rgba(212,168,83,0.35)] transition-[transform,filter] hover:brightness-105 hover:shadow-[0_12px_40px_rgba(212,168,83,0.45)] active:scale-[0.99]"
        >
          <UserPlus className="h-5 w-5" aria-hidden />
          Create New Model ✦
        </button>
      </div>

      {models.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c12] px-6 py-16 text-center">
          <p className="font-[var(--font-heading)] text-lg text-white/90">No creators yet ✦</p>
          <p className="mt-2 text-sm text-white/45">Create your first model to appear on Discover and Browse.</p>
        </div>
      ) : (
        <ModelList models={models} onChanged={handleChanged} onToast={pushToast} />
      )}

      <CreateModelModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleChanged}
        onToast={pushToast}
      />
    </div>
  );
}
