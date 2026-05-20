import { createFileRoute } from "@tanstack/react-router";
import { PartnerPage } from "@/components/PartnerPage";

export const Route = createFileRoute("/en/partner")({
  head: () => ({
    meta: [
      { title: "Bura · Partners" },
      {
        name: "description",
        content:
          "Become a Bura partner and help us build an open platform for clean air across the Western Balkans.",
      },
      { property: "og:title", content: "Bura · Partners" },
      {
        property: "og:description",
        content: "We are looking for partners from companies, education, health and media.",
      },
    ],
  }),
  component: () => <PartnerPage lang="en" />,
});
