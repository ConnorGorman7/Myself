import { redirect } from "next/navigation";

// The portfolio now lives at "/". Keep /work working for old links;
// project pages stay at /work/[slug].
export default function Work() {
  redirect("/");
}
