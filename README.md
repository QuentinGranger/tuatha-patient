# Tuatha - Application Patient

![Tuatha Logo](./tuatha-webapp/public/logo.png)

## 📱 Vue d'ensemble

Tuatha est une application mobile-first innovante conçue pour faciliter la communication et la gestion des rendez-vous entre les patients et les professionnels de santé. Avec une interface intuitive et élégante, Tuatha permet aux patients de consulter leurs professionnels, gérer leurs rendez-vous et communiquer efficacement via chat et appels vidéo.

## ✨ Fonctionnalités principales

### 👨‍⚕️ Gestion des professionnels
- Consultation des profils détaillés des professionnels de santé
- Accès aux informations de contact et spécialités
- Visualisation des disponibilités

### 📅 Gestion des rendez-vous
- Calendrier interactif pour visualiser les rendez-vous passés et à venir
- Prise, modification et annulation de rendez-vous (avec confirmations)
- Filtres pour trier et visualiser différents types de rendez-vous
- Protection contre les annulations de dernière minute (< 24h)

### 💬 Communication
- Chat en temps réel avec les professionnels
- Appels vidéo intégrés avec interface inspirée d'iMessage
- Partage de documents et d'informations médicales

## 🛠️ Technologies utilisées

- **Framework**: [Next.js](https://nextjs.org/) avec App Router
- **Langage**: [TypeScript](https://www.typescriptlang.org/)
- **Styles**: CSS Modules pour une modularité optimale
- **Icônes**: [React Icons](https://react-icons.github.io/react-icons/)
- **État**: Gestion d'état React (useState, useEffect, useContext)

## 🎨 Approche de conception

L'application a été conçue selon une approche **mobile-first**, garantissant une expérience utilisateur optimale sur les appareils mobiles tout en s'adaptant aux écrans plus grands. Le design utilise des éléments de glassmorphisme et un système de couleur harmonieux centré autour de dégradés d'orange pour une identité visuelle distinctive.

## 🚀 Installation et démarrage

```bash
# Cloner le dépôt
git clone https://github.com/QuentinGranger/tuatha-patient.git
cd tuatha-patient/tuatha-webapp

# Installer les dépendances
npm install

# Démarrer l'application en mode développement
npm run dev
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000)

## 📂 Structure du projet

```
tuatha-webapp/
├── app/                    # Structure principale (App Router)
│   ├── components/         # Composants réutilisables
│   ├── mespros/            # Page des professionnels et rendez-vous
│   ├── professionnels/     # Pages des profils de professionnels
│   └── layout.tsx          # Layout principal de l'application
├── public/                 # Ressources statiques
└── package.json            # Dépendances et scripts
```

## 🖼️ Composants clés

### AppointmentManager
Gère les rendez-vous des patients avec les fonctionnalités de prise de RDV, annulation et modification.

### Calendar
Calendrier interactif permettant de visualiser et gérer les rendez-vous, avec des indicateurs visuels pour distinguer les rendez-vous à venir, passés ou annulés.

### VideoCall
Interface d'appel vidéo inspirée d'iMessage, avec gestion de l'état de l'appel (sonnerie, en cours, terminé).

## 📱 Compatibilité

L'application est optimisée pour fonctionner sur:
- iOS (Safari)
- Android (Chrome)
- Navigateurs desktop modernes (Chrome, Firefox, Safari, Edge)

## 🔒 Confidentialité

L'application a été conçue en tenant compte des bonnes pratiques en matière de confidentialité des données médicales, avec des mécanismes d'autorisation et d'authentification robustes.

## 🔮 Évolutions futures

- Intégration de notifications push
- Support pour la télémédecine avancée
- Intégration avec des objets connectés de santé
- Historique médical interactif

## 📄 Licence

© 2025 Tuatha - Tous droits réservés

---

Développé avec ❤️ pour faciliter l'accès aux soins
