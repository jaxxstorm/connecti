---
title: How to Connect to an AWS Private Subnet
description: Learn how to connect to an AWS Private Subnet using connecti.
---

`connecti` will launch an AWS autoscaling group with a single instance inside an [AWS VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)

It creates the following resources:

- an encrypted SSM parameter to store your Tailscale API key
- an IAM role that allows EC2 to read that encrypted parameter
- a [launch [configuration](https://docs.aws.amazon.com/autoscaling/ec2/userguide/launch-configurations.html) that specifies EC2 instance configuration including user data to install the Tailscale components
- an autoscaling group with a min, max, and desired size of 1, so if someone kills your Tailscale bastion it will be restarted

## Prerequisites

Before running `connecti` you need to have valid AWS credentials for the AWS that contains the VPC you want to connect to.

You can verify this by running:

```
aws sts get-caller-identity
```

If you have valid AWS credentials, you then need to populate your configuration options. You'll need:

- to set your AWS region
- to specify your tailscale api key
- to specify your tailnet
- to specify the route for the VPC

You can do this via environment variables or the configuration file.

## Connecting

Once you've set up your environment, you need to provision your bastion. You can do this by specifying the subnets you want to connect to. `connecti` takes a list of subnets, these subnets all need to be within the same VPC

```
connecti connect aws --subnet-ids subnet-0b5bef562bf7308b8 --route "172.20.0.0/22"
```

## Disconnecting

Once you're done using your private connection, you can destroy the connection by name. Listing the connections is done like so:

```
connecti list
```

Then, select the `connecti` instance you'd like to destroy, and disconnect:

```
connecti disconnect aws --name <my-name>
```
