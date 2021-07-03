# Projet_6_API_REST
P6_Construisez une API sécurisée pour une application d'avis gastronomiques

Pour faire fonctionner et interagir l'application avec une base de donnée, l'utilisateur doit créer un fichier .env avec les codes d'accès qu'il aura crée avec un compte sur mongodb un exemple du fichier est fournit dans le dossier backend


[présentation]

Il s'agit d'un projet de création d'API sécurisée pour une application d'avis gastronomiques, elle contient :
- Un système d'authentification
- Une requête de liste des sauces sur la page principale
- Un module d'ajout de sauce
- Un module de modification/suppresion de sauce (pour son créateur)
- Un système de "Like/Dislike"

[prérequis]

- Pour le faire fonctionner vous devez disposer d'un Navigateur récent (Firefox 85/Chrome 88)
> récupérer le repository : https://github.com/OpenClassrooms-Student-Center/dwj-projet6.git

[installation]

- Installer un navigateur de votre choix (Chrome, Firefox, Opera, Safari...)
- Installer npm install -g @angular/cli@7.0.2
- Installer node sass
- Installer Node.js ainsi que NPM (https://www.npmjs.com/package/npm) avec les packages suivants (en local --save) :
    > cors , mongoose, mongoose-unique-validator, body-parser, express, jsonwebtoken, multer, fs, bcrypt, helmet,dotenv, nodemon

[configuration]

- Pour démarrer le serveur, il vous faut executer server.js, disponible dans le dossier backend.
Depuis 'backend' executez la commande :
> node server.js ou nodemon server

Celui-ci devrait éxecuter une instance du serveur sur le port 3000 de la machine hôte.

- Vous devez également charger l'interface (GUI) depuis le dossier frontend.
Depuis 'frontend/dwj-projet6' executez la commande :
> ng serve

Celui-ci devrait éxecuter une instance du serveur sur le port 4200 de la machine hôte.

[utilisation]
- Une fois que tous les modules sont chargés/compilés;
> Depuis votre navigateur internet veuillez vous rendre sur le site suivant : http://localhost:4200/
