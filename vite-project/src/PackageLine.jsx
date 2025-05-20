import React, { useEffect, useState } from "react";
import { Card } from "antd";
import "./PackageLine.css";

const PACKAGE_WIDTH_PERCENT = 8;
const PACKAGE_MARGIN_PERCENT = 2;
const TOTAL_PACKAGE_SPACE = PACKAGE_WIDTH_PERCENT + PACKAGE_MARGIN_PERCENT;

const PackageLine = () => {
  const [packages, setPackages] = useState([]);
  const [maxId, setMaxId] = useState(0); // čuva najveći ID

  // Dodavanje paketa svakih 2s
  useEffect(() => {
    const interval = setInterval(() => {
      setPackages((prev) => {
        const newId = maxId + 1;
        setMaxId(newId); // ažuriraj max ID
        return [...prev, { id: newId, createdAt: Date.now() }];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [maxId]);

  // Uklanjanje paketa nakon 10s
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setPackages((prev) =>
        prev.filter((pkg) => Date.now() - pkg.createdAt < 10000)
      );
    }, 1000);

    return () => clearInterval(cleanupInterval);
  }, []);

  return (
    <div className="parent">
      {packages.map((pkg, index) => (
        <AnimatedPackage
          key={pkg.id}
          index={index}
          label={`Paket #${index + 1}`}
        />
      ))}
    </div>
  );
};

const AnimatedPackage = ({ index, label }) => {
  const [left, setLeft] = useState("0%");

  useEffect(() => {
    const targetLeft = `calc(100% - ${(index + 1) * TOTAL_PACKAGE_SPACE}%)`;

    const timer = setTimeout(() => {
      setLeft(targetLeft);
    }, 50);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <Card
      className="child"
      style={{
        left: left,
      }}
    >
      {label}
    </Card>
  );
};

export default PackageLine;
