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
		Short: "List all active connectme infrastructure",
		Long:  `List all the connectme infrastructure from the backend store`,
		RunE: func(cmd *cobra.Command, args []string) error {

			projectName := "connectme"
			ctx := context.Background()

			ws, err := auto.NewLocalWorkspace(ctx, auto.Project(workspace.Project{
				Name:    tokens.PackageName(projectName),
				Runtime: workspace.NewProjectRuntimeInfo("go", nil),
			}))
			if err != nil {
				return fmt.Errorf("error listing connectme instances: %v", err)
			}

			stacks, err := ws.ListStacks(ctx)
			if err != nil {
				return fmt.Errorf("error listing connectme instances: %v", err)
			}

			writer := tabwriter.NewWriter(os.Stdout, tabwriterMinWidth, tabwriterWidth, tabwriterPadding, tabwriterPadChar, tabwriterFlags)
			fmt.Fprintln(writer, "NAME\tLAST UPDATE\t# RESOURCES\tURL")

			for _, stack := range stacks {
				var url string
				var resourceCount int
				if stack.URL == "" {
					url = "Not available"
				} else {
					url = stack.URL
				}

				if stack.ResourceCount == nil {
					resourceCount = 0
				} else {
					resourceCount = *stack.ResourceCount
				}

				fmt.Fprintf(writer, "%s\t%s\t%d\t%s\n", stack.Name, stack.LastUpdate, resourceCount, url)
			}

			writer.Flush()

			return nil

		},
	}

	return command
}
