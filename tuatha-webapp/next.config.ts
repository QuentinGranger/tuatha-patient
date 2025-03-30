import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Optimisations pour le développement */
  reactStrictMode: false, // Désactiver le mode strict en développement pour des performances améliorées
  
  // Optimiser le chargement des images
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'development', // Désactiver l'optimisation des images en dev
  },
  
  // Configurations pour une application mobile-first
  experimental: {
    optimizeCss: true, // Optimiser le CSS
    scrollRestoration: true, // Améliorer le scroll sur mobile
  },
  
  // Mise en cache agressive pour le développement
  onDemandEntries: {
    // Période pendant laquelle les pages compilées sont conservées en mémoire
    maxInactiveAge: 60 * 60 * 1000, // 1 heure
    // Nombre de pages à garder en mémoire
    pagesBufferLength: 5,
  },
};

export default nextConfig;
