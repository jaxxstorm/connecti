package list

import (
	"context"
	"fmt"
	"github.com/liggitt/tabwriter"
	"github.com/pulumi/pulumi/sdk/v3/go/auto"
	"github.com/pulumi/pulumi/sdk/v3/go/common/tokens"
	"github.com/pulumi/pulumi/sdk/v3/go/common/workspace"
	"github.com/spf13/cobra"
	"os"
	//"github.com/spf13/viper"
)

const (
	tabwriterMinWidth = 6
	tabwriterWidth    = 4
	tabwriterPadding  = 3
	tabwriterPadChar  = ' '
	tabwriterFlags    = tabwriter.RememberWidths
)

var ()

func Command() *cobra.Command {
	command := &cobra.Command{
		Use:   "list",
		Short: "List all active connecti infrastructure",
		Long:  `List all the connecti infrastructure from the backend store`,
		RunE: func(cmd *cobra.Command, args []string) error {

			projectName := "connecti"
			ctx := context.Background()

			ws, err := auto.NewLocalWorkspace(ctx, auto.Project(workspace.Project{
				Name:    tokens.PackageName(projectName),
				Runtime: workspace.NewProjectRuntimeInfo("go", nil),
			}))
			if err != nil {
				return fmt.Errorf("error listing connecti instances: %v", err)
			}

			stacks, err := ws.ListStacks(ctx)
			if err != nil {
				return fmt.Errorf("error listing connecti instances: %v", err)
			}

			writer := tabwriter.NewWriter(os.Stdout, tabwriterMinWidth, tabwriterWidth, tabwriterPadding, tabwriterPadChar, tabwriterFlags)
			fmt.Fprintln(writer, "NAME\tLAST UPDATE\t# RESOURCES\tTYPE\tURL")

			for _, stack := range stacks {
				var url string
				var resourceCount int
				var connectiType string

				// FIXME: this is going to be very slow for lots of stacks.
				// I don't love it..
				if stack.ResourceCount == nil {
					resourceCount = 0
				} else {
					resourceCount = *stack.ResourceCount
					_, err := ws.RefreshConfig(ctx, stack.Name)
					if err != nil {
						return fmt.Errorf("error refreshing config for stack %s: %v", stack.Name, err)
					}
				}

				cfg, err := ws.GetConfig(ctx, stack.Name, "connecti:type")

				if err != nil {
					return fmt.Errorf("error retrieving config value for stack %s: %v", stack.Name, err)
				}

				connectiType = cfg.Value

				if stack.URL == "" {
					url = "Not available"
				} else {
					url = stack.URL
				}
				fmt.Fprintf(writer, "%s\t%s\t%d\t%s\t%s\n", stack.Name, stack.LastUpdate, resourceCount, connectiType, url)
			}

			writer.Flush()

			return nil

		},
	}

	return command
}
