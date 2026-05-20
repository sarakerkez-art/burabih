import { createFileRoute } from "@tanstack/react-router";
import { PartnerPage } from "@/components/PartnerPage";

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      { title: "Bura · Partneri" },
      {
        name: "description",
        content:
          "Postanite partner Bure i pomognite nam da gradimo otvorenu platformu za čist zrak na Zapadnom Balkanu.",
      },
      { property: "og:title", content: "Bura · Partneri" },
      {
        property: "og:description",
        content: "Tražimo partnere iz kompanija, obrazovanja, zdravstva i medija.",
      },
    ],
  }),
  component: () => <PartnerPage lang="bs" />,
});
