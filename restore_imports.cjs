const fs = require('fs');

const imports = `import { useState, FormEvent, useEffect, useMemo, useRef, useCallback, Suspense, lazy } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { toast } from "../components/Toast";
import { useAssetData } from "../hooks/useAssetData";
import { DashboardSkeleton } from "../components/dashboard/DashboardSkeleton";
import { Helmet } from "react-helmet-async";
import {
  Search,
  Wallet,
  TrendingUp,
  TrendingDown,
  Activity,
  ChevronRight,
  BarChart2,
  List,
  RefreshCw,
  Info,
  Star,
  Command,
} from "lucide-react";

const AssetChart = lazy(() => import("../components/dashboard/AssetChart"));
`;

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = imports + content;
  fs.writeFileSync(file, content);
}

fix('src/pages/CryptoDashboard.tsx');
fix('src/pages/StockDashboard.tsx');
