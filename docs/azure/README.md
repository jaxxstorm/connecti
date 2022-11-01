# AWS

`connecti` will launch an Azure scaleset which allows you to route traffic and access an Azure [Virtual Network](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview)

It creates the following resources:

- an Azure scaleset running Tailscale


# Prerequisites

Before running `connecti` you need to have created an Azure virtual network and subnet, as well as valid Azure credentials, and have selected a subscription

You can verify this by running:

```
az account show
```

If you have valid Azure credentials, you then need to populate your configuration options. You'll need:

- specify the resource group your virtual network resides in
- specify the name of your virtual network
- specify the name of the subnet you wish to provision your `connecti` bastion
- to specify your tailscale api key
- to specify your tailnet
- to specify the routes you wish to propagate

You can do this via environment variables, command line flags, or the configuration file.

# Connecting

Once you've set up your environment, you need to provision your bastion. You'll need to specify the routes you wish to propagate

```
connecti connect azure --subnet-name tailscale --virtual-network-name tailscale722bd552 --route 172.16.0.0/22 --resource-group-name tailscale243d4895
```

# Disconnecting

Once you're done using your private connection, you can destroy the connection by name. Listing the connections is done like so:

```
connecti list
```

Then, select the `connecti` instance you'd like to destroy, and disconnect:

```
connecti disconnect azure --name <my-name>
```