const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const AUTOPUSH_INTERVAL = 60 * 60 * 1000; // 1 heure en millisecondes
const PROJECT_ROOT = path.resolve(__dirname, '../');

// Fonction pour exécuter git push
function gitAutoPush() {
  // Se positionner à la racine du projet
  process.chdir(PROJECT_ROOT);
  
  // Vérifier s'il y a des modifications à commiter
  exec('git status --porcelain', (error, stdout, stderr) => {
    if (error) {
      console.error('\x1b[31m%s\x1b[0m', '❌ Erreur lors de la vérification git status:', error);
      return;
    }
    
    // S'il y a des modifications
    if (stdout.trim()) {
      const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      console.log('\n\x1b[33m%s\x1b[0m', `🔄 Auto-push en cours (${timestamp})...`);
      
      // Exécuter git add, commit et push
      exec('git add .', (addError) => {
        if (addError) {
          console.error('\x1b[31m%s\x1b[0m', '❌ Erreur lors de git add:', addError);
          return;
        }
        
        exec(`git commit -m "Auto-commit: ${timestamp}"`, (commitError) => {
          if (commitError) {
            console.error('\x1b[31m%s\x1b[0m', '❌ Erreur lors de git commit:', commitError);
            return;
          }
          
          exec('git push', (pushError) => {
            if (pushError) {
              console.error('\x1b[31m%s\x1b[0m', '❌ Erreur lors de git push:', pushError);
              return;
            }
            
            console.log('\x1b[32m%s\x1b[0m', '✅ Auto-push terminé avec succès!');
          });
        });
      });
    } else {
      console.log('\x1b[36m%s\x1b[0m', '📝 Aucune modification détectée. Auto-push ignoré.');
    }
  });
}

// Démarrer le serveur Next.js
console.log('\x1b[34m%s\x1b[0m', '🚀 Démarrage du serveur Next.js avec auto-push toutes les heures...');
console.log('\x1b[34m%s\x1b[0m', '📂 Dossier du projet: ' + PROJECT_ROOT);

// Lancer le serveur Next.js
const nextDev = spawn('npx', ['next', 'dev'], { 
  stdio: 'inherit',
  shell: true
});

// Gérer la sortie du processus Next.js
nextDev.on('close', (code) => {
  console.log(`\n\x1b[34m%s\x1b[0m`, `📢 Serveur Next.js arrêté avec le code: ${code}`);
  clearInterval(autopushInterval);
  process.exit(code);
});

// Configurer l'intervalle d'auto-push
console.log('\x1b[32m%s\x1b[0m', `⏱️  Auto-push configuré pour s'exécuter toutes les heures`);
const autopushInterval = setInterval(gitAutoPush, AUTOPUSH_INTERVAL);

// Premier auto-push après 5 minutes pour capturer les modifications initiales
console.log('\x1b[32m%s\x1b[0m', `⏰ Premier auto-push prévu dans 5 minutes`);
setTimeout(gitAutoPush, 5 * 60 * 1000);

// Gérer l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n\x1b[34m%s\x1b[0m', '🛑 Arrêt du service auto-push et du serveur Next.js...');
  clearInterval(autopushInterval);
  process.exit(0);
});
