`connecti` will launch a Kubernetes deployment which allows you to route traffic and access private cluster resources like Cluster IPs

It creates the following resources:

- a Kubernetes deployment that contains the latest tailscale image
- a Kubernetes secret containing an ephemeral and pre-authorized auth key


## Prerequisites

Before running `connecti` you need to have a running Kubernetes cluster and a valid `KUBECONFIG` to access that cluster.

You can verify this by running:

```
kubectl cluster-info
```

If you have valid kubernetes credentials, you then need to populate your configuration options. You'll need:

- to specify your tailscale api key
- to specify your tailnet
- to specify the routes you wish to propagate

You can do this via environment variables, command line flags, or the configuration file.

## Connecting

Once you've set up your environment, you need to provision your bastion. You'll need to specify the routes you wish to propagate

```
connecti connect kubernetes --routes 10.100.0.0/16
```

## Disconnecting

Once you're done using your private connection, you can destroy the connection by name. Listing the connections is done like so:

```
connecti list
```

Then, select the `connecti` instance you'd like to destroy, and disconnect:

```
connecti disconnect kubernetes --name <my-name>
```
