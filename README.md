# Projet-WEB-ISEN - Projet Année 3

## Description du sujet

La partie web du projet a pour objectif de fournir une interface utilisateur complète pour l'interaction avec les données AIS des navires. Elle permet de visualiser, ajouter, filtrer et analyser ces données via une interface dynamique, moderne et responsive

---

## Table des matières

- [Description du sujet](#description-du-sujet)
- [Objectifs WEB](#objectifs-ia)
- [Fonctionnalités WEB](#fonctionnalit%C3%A9s-ia)
- [Outils utilisés](#outils-utilises)
- [Organisation de la partie WEB](#organisation-de-la-partie-ia)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [Auteurs](#auteurs)

---

## Objectifs WEB

- Programmation web coté client (front-end) :
  - Créer une maquette visuelle d’un site web
  - Programmer les éléments de la maquette visuelle en HTML
  - Programmer le style de la maquette visuelle en CSS
  - Modifier le comportement de la page web en JavaScript
  - Manipuler AJAX
- Programmation web coté serveur (back-end) :
  - Créer un code PHP qui encapsule les requêtes permettant d’interagir avec la base de données
  - Traiter les réponses des requêtes en PHP et envoyer des réponses au client

---

## Fonctionnalités WEB

### 1. Page d’accueil
- Ajout d’un menu pour naviguer entre les différentes pages du site
- Descriptif rapide du projet
- Image représentant le projet

### 2. Ajout de données en lien avec la base de données
- Ajouter un point de donnée (lié à un bateau) dans la base de donnée
- Page web contenant un formulaire permettant d’ajouter un nouveau point

### 3. Visualisation des bateaux dans un tableau et sur une carte
- Tous les bateaux de la base de données web devront apparaître
  - Dans un tableau
  - Sur une carte
    - La trajectoire de chaque bateau devra être visible sur la carte
    - Les détails du bateau seront visibles lors du survol (ou du clic) d'un point avec la souris
 
### 4. Prédiction du cluster des bateaux
- Prédiction du cluster (comportements) des bateaux entrés dans la base de données web
- Les clusters doivent pouvoir être prédit à la suite des actions suivantes :
  - Clic sur un bouton « Prédire les clusters » en bas de la page web de visualisation des bateaux
  - Ouverture d’une nouvelle page
  - Appel coté serveur de votre script Python permettant de prédire les clusters
  - Affichage des bateaux sur une carte
  - Les bateaux seront colorés en fonction de leur cluster d’appartenance

### 5. Prédiction du type et de la trajectoire d’un bateau
- Prédiction du type et de la trajectoire d'un bateau de la base de données web
- Le type ou la trajectoire d'un bateau doivent être prédits, avec les méthodes de classification réalisées en IA à la suite des actions suivantes :
  - Sélection d’un bateau dans le tableau à l’aide d’un bouton radio
  - Clic sur un bouton « Prédire le type » ou « Prédire la trajectoire » en bas de la page web de visualisation des bateaux
  - Ouverture d’une nouvelle page
  - Appel coté serveur de vos scripts Python permettant de faire les prédictions
  - Affichage du résultat comparatif des méthodes de classification réalisées en IA

---

## Outils utilisés

- **Langage** : HTML, CSS, PHP, Javascript, Python
- **Librairies** :

---

## Structure du projet

```
Projet-WEB-ISEN/
├── .vscode/
│   └── settings.json
│
├── back/
│   ├── api/
│   │   ├── ajout.php
│   │   ├── cluster.php
│   │   ├── get_bateaux.php
│   │   ├── get_positions.php
│   │   ├── login.php
│   │   ├── logout.php
│   │   ├── me.php
│   │   ├── prediction_type.php
│   │   ├── register.php
│   │   ├── type.php
│   │   └── update_delete_position.php
│   ├── config/
│   │   └── db.php
│   └── includes/
│       └── functions.php
│
├── data/
│   ├── sql/
│   │   └── init.sql
│   ├── export_IA.csv
│   └── vessel-total-clean.csv
│
├── front/
│   ├── assets/
│   │   └── img/
│   │       ├── cargo.jpg
│   │       ├── cartoon-cargo.png
│   │       ├── cartoon-cargo-removebg.png
│   │       ├── logo.ico
│   │       ├── logo.png
│   │       ├── passenger.jpg
│   │       └── tanker.jpg
│   ├── css/
│   │   ├── modal.css
│   │   ├── style.css
│   │   └── type.css
│   ├── js/
│   │   ├── ajout.js
│   │   ├── auth.js
│   │   ├── clusther.js
│   │   ├── main.js
│   │   ├── modal.js
│   │   ├── script.js
│   │   ├── session.js
│   │   ├── type.js
│   │   └── visualisation.js
│   ├── ajout.html
│   ├── prediction_cluster.html
│   ├── predition_type.html
│   ├── type.html
│   ├── visualisation.html
├── scipts/
│   ├── venv/ (environnement virtuelle)
│   ├── .gitignore
│   ├── csv_bdd.py
│   ├── donnees_a_importer.sql
│   ├── label_encoder_r.pkl
│   ├── predict_cluster.py
│   ├── predict_trajectory.py
│   ├── predict_type.py
│   ├── random_forest_model_r.pkl
│   ├── scaler_r.pkl
│   └── vessel-clean-final.csv
├── .htaccess
├── index.html
├── init_projet.sh
└── README.md
```

---

## Auteurs

- [Emile Duplais](https://github.com/R5dM1st)
- [Matteo D'ettore](https://github.com/matteodettore)
- [Alex LETOUZE](https://github.com/Alex-LTZ)

