import sys
import os
import joblib
import numpy as np

def predict_vessel_type(status, length, width, draft, mmmsi):
    # Dossier du script actuel
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Chemins complets vers les fichiers modèles et preprocessors
    model_path = os.path.join(script_dir, 'random_forest_model_r.pkl')
    scaler_path = os.path.join(script_dir, 'scaler_r.pkl')
    label_encoder_path = os.path.join(script_dir, 'label_encoder_r.pkl')

    # Chargement des fichiers
    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
    label_encoder = joblib.load(label_encoder_path)

    # Prépare les données en tableau numpy
    X_new = np.array([[status, length, width, draft, mmmsi]])

    # Applique la mise à l'échelle
    X_scaled = scaler.transform(X_new)

    # Prédiction (encodée)
    y_pred_encoded = model.predict(X_scaled)

    # Décodage en label original
    y_pred = label_encoder.inverse_transform(y_pred_encoded)

    return y_pred[0]

if __name__ == "__main__":
    if len(sys.argv) != 6:
        print("Erreur : 5 arguments attendus (status, length, width, draft, mmmsi).", file=sys.stderr)
        sys.exit(1)

    try:
        status = float(sys.argv[1])
        length = float(sys.argv[2])
        width = float(sys.argv[3])
        draft = float(sys.argv[4])
        mmmsi = float(sys.argv[5])
    except ValueError:
        print("Erreur : les arguments doivent être numériques.", file=sys.stderr)
        sys.exit(1)

    prediction = predict_vessel_type(status, length, width, draft, mmmsi)
    print(prediction)
