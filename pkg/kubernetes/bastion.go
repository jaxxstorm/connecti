package kubernetes

import (
	"fmt"

	k8stailscale "github.com/lbrlabs/pulumi-tailscale-bastion/sdk/go/bastion/kubernetes"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func Bastion(args BastionArgs) pulumi.RunFunc {
	return func(ctx *pulumi.Context) error {

		// convert the routes to a pulumi string array
		routes := pulumi.StringArray{}
		for _, route := range args.Routes {
			routes = append(routes, pulumi.String(route))
		}

		bastion, err := k8stailscale.NewBastion(ctx, args.Name, &k8stailscale.BastionArgs{
			Routes:          pulumi.StringArray(routes),
			CreateNamespace: args.CreateNamespace,
		})
		if err != nil {
			return fmt.Errorf("error creating bastion: %v", err)
		}

		ctx.Export("deploymentName", bastion.DeploymentName)
		ctx.Export("connectiType", pulumi.String("k8s"))

		return nil
	}
}
