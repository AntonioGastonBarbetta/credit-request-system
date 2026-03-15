This folder contains minimal Kubernetes manifests to get the system running in a cluster.

They are examples only — adapt image names, secrets, and resource limits for production.

Files:
- `postgres.yaml` — Postgres Deployment + Service
- `redis.yaml` — Redis Deployment + Service
- `deployment-backend.yaml` — Backend Deployment + Service

Apply them with:

```bash
kubectl apply -f k8s/
```
