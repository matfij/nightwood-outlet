## Re: Nightwood Outlet

### Requirements:
 - Docker
 - Kubernetes
 - Skaffold
 - Node.js
 - npm

### Digital Ocean:
 - setup k8s context: `doctl kubernetes cluster kubeconfig save <nw-outlet>`
 - switch k8s context: `kubectl config use-context <do-fra1-nw-outlet>`
 - install ingress controller: `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.7.0/deploy/static/provider/cloud/deploy.yaml`
