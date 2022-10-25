package disconnect

import (
	"github.com/jaxxstorm/connecti/cmd/cli/disconnect/aws"
	"github.com/spf13/cobra"
)

func Command() *cobra.Command {
	command := &cobra.Command{
		Use:   "disconnect",
		Short: "Disconnect commands",
		Long:  "Commands that disconnect infrastructure",
	}

	command.AddCommand(aws.Command())

	return command
}
