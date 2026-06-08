import { redirect } from "next/navigation";

type RootPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RootPage({ searchParams }: RootPageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (typeof value === "string") query.set(key, value);
    else if (Array.isArray(value)) value.forEach((item) => query.append(key, item));
  });
  const suffix = query.toString() ? `?${query.toString()}` : "";
  redirect(`/welcome${suffix}`);
}
