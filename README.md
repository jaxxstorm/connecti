# connectme

`connectme` is a command line tool to quickly connect you to cloud infrastructure via [Tailscale](https://tailscale.com)

## About

If you're provisioning cloud infrastructure correctly, you'll provision sensitive services in private subnets. This means they're often not routable from your machine or your CI/CD infrastructure, which means automating processes and using infrastructure as code tools can be difficult.

[Tailscale](https://tailscale.com) is a VPN service that allows you to quickly connect to remote infrastructure without the need to punch holes inside your security posture. It supports quickly spinning up nodes that will advertise routes as well, making it ideal for "ephemeral" VPN infrastructure.

`connectme` uses [Pulumi](https://pulumi.com)'s [Automation API](https://www.pulumi.com/automation/) to take the pain out of provisioning the infrastructure needed to provision the VPN. It declaratively creates Tailscale API keys, stores them in the cloud provider's secret store, and then creates a small compute node for which to advertise routes for you.

**This is not intended to be used as a production tool!*Its main purpose is for you to quickly debug things or provision infrastructure during automated processes.

## Installing

Coming soon

## Usage

### Prerequisites

#### Pulumi

`connectme` uses Pulumi's automation API. You'll need to ensure you have the Pulumi CLI installed and be logged into a state backend.

Installation docs for your operating system can be found [here](https://www.pulumi.com/docs/get-started/install/)

Once you've installed the Pulumi CLI, you'll need to choose a valid backend. The easiest backend to use is the Pulumi Service backend. Just run the login command, and create an account:

```
pulumi login
```

Individual accounts are free forever.

If you don't wish to use the Pulumi service, there are other options. 

The second easiest backend to use is the [Local Backend](https://www.pulumi.com/docs/intro/concepts/state/#logging-into-the-local-filesystem-backend)

```
pulumi login --local
```

#### Cloud Provider

Before using `connectme` - you'll need to make sure you have valid cloud provider credentials for the account you wish to use. The mechanism you'll use to provision credentials will be different depending on your cloud provider and authentication mechanism. See the provider-specific documentation below.

You'll need then to sign up to [Tailscale](https://tailscale.com/kb/1017/install/) and create a "Tailnet". Information on how to do this will depend on your operating system. Tailscale offers a generous free tier for individuals.

Once you've created your Tailnet, you'll need to make a note of the name from [here](https://login.tailscale.com/admin/settings/general).

Finally, you'll also need a Tailscale API key, to allow you to create resources in Tailscale. You can provision an API key from [here](https://login.tailscale.com/admin/settings/keys)

### Provisioning

Provisioning your infrastructure will depend on the cloud provider you're using. At the time of writing, `connectme` supports the following cloud providers:

| Cloud Provider| Usage Documentation|
| ------------- |:-------------:|
| AWS           | [Docs](../docs/aws/README.md) |

## Configuration

`connectme` has a configuration file that you can specify when you run the program using the `-`-config` flag or you can store it in the default location `${HOME}/.connectme.yaml`.

The configuration file allows you to store common configurations so you don't have to specify them as command line flags:

```yaml
tailnet: "my-tailnet"
aws:region: "us-west-2"
```

You can also specify configuration values as environment variables. The full list of configuration values and environment variables is as follows:

| Environment Variables| Configuration| Example
| ------------- |-------------| :-----------:|
| TAILSCALE_API_KEY | apiKey     | tskey-<random> |
| TAILSCALE_TAILNET | tailnet    | my-cool-tailnet |
| AWS_REGION        | aws:region | us-west-2 |

## Caveats

Coming soon

