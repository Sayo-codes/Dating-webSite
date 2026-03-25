import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin – Creators",
  description: "Redirect to Models",
};

/** Legacy URL: creator management lives under /admin/models. */
export default function AdminCreatorsRedirectPage() {
  redirect("/admin/models");
}
