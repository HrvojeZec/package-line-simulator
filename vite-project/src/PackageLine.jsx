import React, { useEffect, useState } from "react";
import { Card } from "antd";
import "./PackageLine.css";

const PACKAGE_WIDTH_PERCENT = 8;
const PACKAGE_MARGIN_PERCENT = 2;
const TOTAL_PACKAGE_SPACE = PACKAGE_WIDTH_PERCENT + PACKAGE_MARGIN_PERCENT;

const PackageLine = () => {
  const [packages, setPackages] = useState([]);
  const [maxId, setMaxId] = useState(0);

  // Dodavanje novih paketa sa statusom "incoming"
  useEffect(() => {
    const interval = setInterval(() => {
      setPackages((prev) => {
        const newId = maxId + 1;
        setMaxId(newId);
        return [
          ...prev,
          {
            id: newId,
            status: "incoming",
            createdAt: Date.now(),
          },
        ];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [maxId]);

  // Promjena statusa iz "incoming" u "queue" nakon 10s
  useEffect(() => {
    const statusInterval = setInterval(() => {
      const now = Date.now();

      setPackages((prev) =>
        prev
          .map((pkg) => {
            if (pkg.status === "incoming" && now - pkg.createdAt > 10000) {
              return { ...pkg, status: "queue", updatedAt: now };
            }
            return pkg;
          })
          // Ukloni pakete starije od 20 sekundi (ukupno vrijeme)
          .filter((pkg) => now - pkg.createdAt < 20000)
      );
    }, 1000);

    return () => clearInterval(statusInterval);
  }, []);

  // Razdvajanje po statusu
  const incoming = packages.filter((p) => p.status === "incoming");
  const queue = packages.filter((p) => p.status === "queue");

  return (
    <div>
      <div className="track-label">📥 Incoming</div>
      <div className="parent">
        {incoming.map((pkg, index) => (
          <AnimatedPackage
            key={pkg.id}
            index={index}
            label={`Paket #${pkg.id}`}
            top="30%"
          />
        ))}
      </div>

      <div className="track-label">📦 Queue</div>
      <div className="parent second-line">
        {queue.map((pkg, index) => (
          <AnimatedPackage
            key={`q-${pkg.id}`}
            index={index}
            label={`Queue #${pkg.id}`}
            top="30%"
          />
        ))}
      </div>
    </div>
  );
};

const AnimatedPackage = ({ index, label, top }) => {
  const [left, setLeft] = useState("0%");

  useEffect(() => {
    const targetLeft = `calc(100% - ${(index + 1) * TOTAL_PACKAGE_SPACE}%)`;
    const timer = setTimeout(() => setLeft(targetLeft), 50);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <Card
      className="child"
      style={{
        left,
        top,
      }}
    >
      {label}
    </Card>
  );
};

export default PackageLine;
