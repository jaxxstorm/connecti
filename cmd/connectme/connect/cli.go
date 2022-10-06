package connect

import (
	"github.com/jaxxstorm/connectme/cmd/connectme/connect/aws"
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