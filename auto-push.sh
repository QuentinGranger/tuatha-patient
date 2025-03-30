#!/bin/bash

# Se placer dans le répertoire du projet
cd /Users/user/Desktop/tuatha-patient-app

# Récupérer la date et l'heure actuelles pour le message de commit
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

# Vérifier s'il y a des changements à commiter
if [[ -n $(git status -s) ]]; then
    # Ajouter tous les fichiers modifiés
    git add .
    
    # Créer un commit avec un message horodaté
    git commit -m "Auto-commit: $TIMESTAMP"
    
    # Pousser les changements vers le dépôt distant
    git push
    
    echo "✅ Auto-push effectué à $TIMESTAMP"
else
    echo "ℹ️ Aucun changement détecté à $TIMESTAMP"
fi
