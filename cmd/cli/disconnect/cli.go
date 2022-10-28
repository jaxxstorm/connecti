package disconnect

import (
	"github.com/jaxxstorm/connecti/cmd/cli/disconnect/aws"
	"github.com/jaxxstorm/connecti/cmd/cli/disconnect/azure"
	"github.com/spf13/cobra"
)

func Command() *cobra.Command {
	command := &cobra.Command{
		Use:   "disconnect",
		Short: "Disconnect commands",
		Long:  "Commands that disconnect infrastructure",
	}

	command.AddCommand(aws.Command())
	command.AddCommand(azure.Command())

	return command
}
