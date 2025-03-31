'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  selector?: string;
}

/**
 * Portal component - permet de rendre des éléments en dehors de la hiérarchie DOM de leur parent
 * Idéal pour les modales, tooltips, etc.
 */
const Portal: React.FC<PortalProps> = ({ 
  children, 
  selector = 'portal-root' 
}) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // S'assurer que le code s'exécute côté client
    setMounted(true);
    
    // Créer l'élément racine du portal s'il n'existe pas
    let portalRoot = document.getElementById(selector);
    if (!portalRoot) {
      portalRoot = document.createElement('div');
      portalRoot.id = selector;
      document.body.appendChild(portalRoot);
    }
    
    // Nettoyer le portal lors du démontage
    return () => {
      if (portalRoot && portalRoot.childNodes.length === 0) {
        document.body.removeChild(portalRoot);
      }
    };
  }, [selector]);
  
  // Ne rien rendre côté serveur ou avant le montage
  if (!mounted) return null;
  
  // Trouver ou créer l'élément racine du portal
  let portalRoot = document.getElementById(selector);
  if (!portalRoot) {
    portalRoot = document.createElement('div');
    portalRoot.id = selector;
    document.body.appendChild(portalRoot);
  }
  
  // Utiliser createPortal pour rendre les enfants dans l'élément racine
  return createPortal(children, portalRoot);
};

export default Portal;
