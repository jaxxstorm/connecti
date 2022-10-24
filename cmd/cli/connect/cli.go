package connect

import (
	"github.com/jaxxstorm/connecti/cmd/cli/connect/aws"
	"github.com/spf13/cobra"
)

func Command() *cobra.Command {
	command := &cobra.Command{
		Use:   "connect",
		Short: "Connect commands",
		Long:  "Commands that connect infrastructure",
	}

	command.AddCommand(aws.Command())

	return command
}
