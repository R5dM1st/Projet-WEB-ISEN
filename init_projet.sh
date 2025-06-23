#!/bin/bash

# Créer les dossiers dans le répertoire courant
mkdir -p front/{css,js,assets/img}
mkdir -p back/{api,config,includes}
mkdir -p data/sql
mkdir -p scripts
mkdir -p docs

# Fichiers front-end
touch front/{index.html,ajout.html,visualisation.html,prediction_cluster.html,prediction_type.html}
touch front/css/style.css
touch front/js/{main.js,ajout.js,visualisation.js,cluster.js,type.js}

# Fichiers back-end
touch back/api/{ajout.php,liste.php,cluster.php,type.php}
touch back/config/db.php
touch back/includes/functions.php

# Fichiers de données
touch data/{vessel-total-clean.csv,export_IA.csv}
touch data/sql/init.sql

# Scripts Python IA
touch scripts/{predict_cluster.py,predict_type.py,predict_trajectory.py}

# Documents livrables PDF
touch docs/{maquette.pdf,charte_graphique.pdf,mcd.pdf,interfaces_client_serveur.pdf,gantt.pdf}

# Fichiers racine
touch README.md
touch .htaccess

echo "✅ Arborescence créée directement dans le dossier courant."

