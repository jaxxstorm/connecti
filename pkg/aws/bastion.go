package aws

import (
	"fmt"
	"strings"

	awstailscale "github.com/lbrlabs/pulumi-tailscale-bastion/sdk/go/bastion/aws"
	"github.com/pulumi/pulumi-aws/sdk/v5/go/aws/ec2"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func Bastion(args BastionArgs) pulumi.RunFunc {
	return func(ctx *pulumi.Context) error {

		// create an array of subnets to pass to the bastion
		var vpcId string
		var route string
		var subnets pulumi.StringArray

		routes := args.Routes

		for _, subnetId := range args.SubnetIds {
			subnet, err := ec2.LookupSubnet(ctx, &ec2.LookupSubnetArgs{
				Id: pulumi.StringRef(subnetId),
			})
			if err != nil {
				return fmt.Errorf("looking up subnet: %v", err)
			}

			if vpcId == "" {
				vpcId = subnet.VpcId
			}

			if vpcId != subnet.VpcId {
				return fmt.Errorf("all subnets must be in the same VPC")
			}
			// check if we're supplying our own routes via the CLI
			if len(routes) == 0 {
				routes = append(routes, subnet.CidrBlock)
			}
			subnets = append(subnets, pulumi.String(subnetId))
		}

		route = strings.Join(routes, ",")

		bastion, err := awstailscale.NewBastion(ctx, args.Name, &awstailscale.BastionArgs{
			VpcId:     pulumi.String(vpcId),
			SubnetIds: subnets,
			Route:     pulumi.String(route),
			TailscaleTags: pulumi.StringArray{
				pulumi.String("tag:bastion"),
			},
			Region:    pulumi.String(args.Region),
		})
		if err != nil {
			return fmt.Errorf("error creating bastion: %v", err)
		}

		ctx.Export("privateKey", bastion.PrivateKey)

		ctx.Export("connectiType", pulumi.String("aws"))

		return nil
	}
}
