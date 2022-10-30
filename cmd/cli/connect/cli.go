package connect

import (
	"github.com/jaxxstorm/connecti/cmd/cli/connect/aws"
	"github.com/jaxxstorm/connecti/cmd/cli/connect/azure"
	"github.com/jaxxstorm/connecti/cmd/cli/connect/kubernetes"
	"github.com/spf13/cobra"
)

func Command() *cobra.Command {
	command := &cobra.Command{
		Use:   "connect",
		Short: "Connect commands",
		Long:  "Commands that connect infrastructure",
	}

	command.AddCommand(aws.Command())
	command.AddCommand(azure.Command())
	command.AddCommand(kubernetes.Command())

	return command
}
