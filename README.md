# Taff - URL Shortener

## Configuration

Avant de démarrer l'application, vous devez créer un fichier `.env` à la racine du projet, sur le modèle du fichier `.env.example`, vous pouvez le copier  avec:

```bash
cp .env.example .env
```

## Démarrage

### Option 1 : Avec Make
Si vous avez `make` installé sur votre système :
```bash
make
```

### Option 2 : Avec Docker Compose
Si vous n'avez pas `make` ou préférez utiliser Docker Compose directement :
```bash
docker compose --env-file .env up
```

Les deux méthodes démarreront l'application complète avec le client et le serveur.
