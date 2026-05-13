import { useEffect, useRef, useState } from "react";

export type SchoolPin = {
  id: string;
  name: string;
  status: string;
  lat: number;
  lng: number;
  color?: "green" | "amber" | "blue";
  href?: string;
  moreLabel?: string;
};

type Props = {
  pins?: SchoolPin[];
  className?: string;
  showTooltips?: boolean;
};

const COLOR: Record<string, string> = {
  green: "#3FAE5A",
  amber: "#E0A82E",
  blue: "#3D7AB5",
};

const GEOJSON_URL =
  "https://raw.githubusercontent.com/johan/world.geo.json/master/countries/BIH.geo.json";

export function BiHMap({ pins = [], className, showTooltips = true }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<unknown>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const L = (await import("leaflet")).default;
      // Inject leaflet CSS once
      if (typeof document !== "undefined" && !document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      // Inject pulse CSS once
      if (typeof document !== "undefined" && !document.getElementById("bih-pulse-css")) {
        const style = document.createElement("style");
        style.id = "bih-pulse-css";
        style.textContent = `
          .bih-pulse-dot { position: relative; width: 14px; height: 14px; }
          .bih-pulse-dot .core {
            position: absolute; inset: 3px; border-radius: 9999px;
            background: var(--bih-color, #3FAE5A);
            box-shadow: 0 0 0 2px white;
          }
          .bih-pulse-dot .ring {
            position: absolute; inset: 0; border-radius: 9999px;
            background: var(--bih-color, #3FAE5A);
            opacity: 0.55;
            animation: bihPulse 1.8s ease-out infinite;
          }
          @keyframes bihPulse {
            0% { transform: scale(0.7); opacity: 0.6; }
            80% { transform: scale(2.4); opacity: 0; }
            100% { transform: scale(2.4); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false,
      });
      mapRef.current = map;

      // No tile layer — minimal background
      const bg = window.getComputedStyle(containerRef.current).backgroundColor;
      containerRef.current.style.background = bg && bg !== "rgba(0, 0, 0, 0)" ? bg : "white";

      // Minimal light basemap with no labels
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
        {
          subdomains: "abcd",
          maxZoom: 19,
          attribution: "",
        },
      ).addTo(map);

      try {
        const res = await fetch(GEOJSON_URL);
        const geo = await res.json();
        const layer = L.geoJSON(geo, {
          style: {
            color: "#1F3A2E",
            weight: 1.8,
            fillColor: "#CDE7D2",
            fillOpacity: 0.85,
          },
        }).addTo(map);
        map.fitBounds(layer.getBounds(), { padding: [10, 10] });
      } catch {
        map.setView([44.0, 17.8], 7);
      }

      pins.forEach((p) => {
        const color = COLOR[p.color ?? "green"];
        const icon = L.divIcon({
          className: "",
          html: `<div class="bih-pulse-dot" style="--bih-color:${color}"><span class="ring"></span><span class="core"></span></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        const marker = L.marker([p.lat, p.lng], { icon }).addTo(map);
        if (showTooltips) {
          const html = `
            <div style="font-family:inherit;min-width:160px">
              <div style="font-weight:600">${p.name}</div>
              <div style="color:#666;margin-top:4px;font-size:12px">${p.status}</div>
              ${p.href ? `<a href="${p.href}" style="display:inline-block;margin-top:6px;color:#E0A82E;font-weight:500;font-size:12px">${p.moreLabel ?? "→"}</a>` : ""}
            </div>`;
          marker.bindPopup(html, { closeButton: false });
        }
      });

      setReady(true);
      cleanup = () => map.remove();
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`relative w-full max-w-xl mx-auto ${className ?? ""}`}>
      <div
        ref={containerRef}
        className="w-full"
        style={{ aspectRatio: "4 / 3", background: "white" }}
        aria-label="Map of Bosnia and Herzegovina"
      />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
          …
        </div>
      )}
    </div>
  );
}
